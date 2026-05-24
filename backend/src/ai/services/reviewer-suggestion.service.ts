import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Repository } from 'typeorm';
import { Model } from 'mongoose';
import { User, Rol } from '../../users/entities/user.entity';
import { Articulo } from '../../articulos/entities/articulo.entity';
import { ArticuloTag } from '../../articulos/entities/articulo-tag.entity';
import { UsuarioCongresoRol } from '../../congresos/entities/usuario-congreso-rol.entity';
import { Asignacion } from '../../asignaciones/entities/asignacion.entity';
import { LLMService } from './llm.service';
import { PlagiarismService } from './plagiarism.service';
import {
  ArticuloDetalle,
  ArticuloDetalleDocument,
} from '../../articulos/schemas/articulo-detalle.schema';
import { ReviewerSuggestion } from '../dto/reviewer-suggestion.dto';
import * as path from 'path';

@Injectable()
export class ReviewerSuggestionService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Articulo)
    private readonly articuloRepository: Repository<Articulo>,
    @InjectRepository(ArticuloTag)
    private readonly articuloTagRepository: Repository<ArticuloTag>,
    @InjectRepository(UsuarioCongresoRol)
    private readonly ucrRepository: Repository<UsuarioCongresoRol>,
    @InjectRepository(Asignacion)
    private readonly asignacionRepository: Repository<Asignacion>,
    @InjectModel(ArticuloDetalle.name)
    private readonly articuloDetalleModel: Model<ArticuloDetalleDocument>,
    private readonly llmService: LLMService,
    private readonly plagiarismService: PlagiarismService,
  ) {}

  async suggestReviewers(articuloId: string): Promise<ReviewerSuggestion[]> {
    const articulo = await this.articuloRepository.findOne({
      where: { id: articuloId },
    });

    if (!articulo) {
      throw new NotFoundException('Artículo no encontrado');
    }

    const detalle = await this.articuloDetalleModel.findOne({ _id: articuloId });
    const revisores = await this.getAvailableReviewers(articulo.congreso_id);

    if (revisores.length === 0) {
      return [];
    }

    let articleText = articulo.titulo || '';
    try {
      if (detalle?.pdf_url) {
        const pdfRelativePath = detalle.pdf_url.replace(/.*\/uploads\//, 'uploads/');
        const pdfPath = path.join(process.cwd(), pdfRelativePath);
        articleText = await this.plagiarismService.extractPdfText(pdfPath);
      }
    } catch (error) {
      console.error('[ReviewerSuggestionService] Error extracting PDF text:', error);
    }

    const tagNames = await this.getArticleTagNames(
      articuloId,
      detalle?.keywords,
    );

    return this.rankReviewersWithAI(articulo, articleText, tagNames, revisores);
  }

  private async getArticleTagNames(
    articuloId: string,
    keywords?: string[],
  ): Promise<string[]> {
    const names = new Set<string>((keywords || []).filter(Boolean));
    try {
      const articuloTags = await this.articuloTagRepository.find({
        where: { articulo_id: articuloId },
        relations: ['tag'],
      });
      for (const at of articuloTags) {
        if (at.tag?.nombre) {
          names.add(at.tag.nombre);
        }
      }
    } catch (error) {
      console.warn(
        '[ReviewerSuggestionService] No se pudieron cargar tags del artículo:',
        error instanceof Error ? error.message : error,
      );
    }
    return Array.from(names);
  }

  private normalizeEspecialidades(
    especialidades: string[] | string | undefined,
  ): string[] {
    if (!especialidades) return [];
    if (Array.isArray(especialidades)) return especialidades;
    return especialidades
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  private async getAvailableReviewers(congresoId?: string): Promise<User[]> {
    let userIds: string[] = [];

    if (congresoId) {
      const membresías = await this.ucrRepository.find({
        where: { congreso_id: congresoId, rol: Rol.REVISOR },
      });
      userIds = membresías.map((m) => m.user_id);
    }

    if (userIds.length === 0) {
      const revisoresGlobales = await this.userRepository.find({
        where: { rol: Rol.REVISOR },
      });
      userIds = revisoresGlobales.map((u) => u.id);
    }

    if (userIds.length === 0) {
      return [];
    }

    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.perfil', 'perfil')
      .where('user.id IN (:...ids)', { ids: userIds })
      .getMany();
  }

  private async rankReviewersWithAI(
    articulo: Articulo,
    articleText: string,
    articleTags: string[],
    revisores: User[],
  ): Promise<ReviewerSuggestion[]> {
    const reviewersInfo = revisores.map((r) => ({
      id: r.id,
      nombre: r.perfil?.nombre || r.nombre || r.email,
      email: r.email,
      especialidades: this.normalizeEspecialidades(r.perfil?.especialidades),
      carrera: r.perfil?.carrera || '',
    }));

    const prompt = this.buildSuggestionPrompt(
      articulo.titulo,
      articleText.substring(0, 2000),
      articleTags,
      reviewersInfo,
    );

    const systemInstruction = `Eres un experto en revisión por pares académica. Tu tarea es analizar un artículo y sugerir los revisores más adecuados basándote en sus especialidades y el tema del artículo. Debes puntuar cada revisor del 0 al 100 basándote en qué tan bien se ajustan sus especialidades al tema del artículo. Devuelve SOLO un JSON válido con este formato:
[
  {
    "reviewer_id": "ID_DEL_REVISOR",
    "match_score": 85,
    "match_reason": "Explicación breve de por qué este revisor es adecuado"
  }
]
Ordena los resultados por match_score descendente.`;

    try {
      const aiResponse = await this.llmService.generateText(
        prompt,
        systemInstruction,
      );
      const rankings = this.parseAIResponse(aiResponse);

      const suggestionsWithNulls = await Promise.all(
        rankings.map(async (ranking) => {
          const revisor = revisores.find((r) => r.id === ranking.reviewer_id);
          if (!revisor) return null;

          const asignacionesCount = await this.getReviewerAssignmentCount(
            revisor.id,
          );
          const especialidades = this.normalizeEspecialidades(
            revisor.perfil?.especialidades,
          );

          return {
            reviewer_id: ranking.reviewer_id,
            nombre: revisor.perfil?.nombre || revisor.nombre || revisor.email,
            email: revisor.email,
            especialidades,
            match_score: ranking.match_score,
            match_reason: ranking.match_reason,
            articulos_asignados: asignacionesCount,
            puede_recibir_mas: asignacionesCount < 3,
          };
        }),
      );

      const suggestions: ReviewerSuggestion[] = suggestionsWithNulls.filter(
        (s): s is ReviewerSuggestion => s !== null,
      );

      if (suggestions.length > 0) {
        return suggestions.sort((a, b) => b.match_score - a.match_score);
      }
    } catch (error) {
      console.error('[ReviewerSuggestionService] Error in AI ranking:', error);
    }

    return this.fallbackRanking(articleTags, revisores);
  }

  private buildSuggestionPrompt(
    titulo: string,
    texto: string,
    tags: string[],
    revisores: {
      id: string;
      nombre: string;
      especialidades: string[];
      carrera: string;
    }[],
  ): string {
    return `Título del artículo: "${titulo}"

Etiquetas del artículo: ${tags.length > 0 ? tags.join(', ') : 'Sin etiquetas'}

Resumen del contenido: ${texto}

Revisores disponibles:
${revisores
  .map(
    (r) =>
      `- ID: ${r.id}
  Nombre: ${r.nombre}
  Especialidades: ${r.especialidades.join(', ') || 'No especificadas'}
  Carrera: ${r.carrera || 'No especificada'}`,
  )
  .join('\n')}

Analiza el artículo y sugiere los mejores revisores basándote en la coincidencia entre sus especialidades y el tema del artículo.`;
  }

  private parseAIResponse(response: string): Array<{
    reviewer_id: string;
    match_score: number;
    match_reason: string;
  }> {
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No se encontró JSON en la respuesta');
      }
      const parsed = JSON.parse(jsonMatch[0]);
      if (!Array.isArray(parsed)) return [];
      return parsed.map((item) => ({
        reviewer_id: String(item.reviewer_id),
        match_score: Number(item.match_score) || 0,
        match_reason: String(item.match_reason || ''),
      }));
    } catch (error) {
      console.error('[ReviewerSuggestionService] Error parsing AI response:', error);
      return [];
    }
  }

  private async getReviewerAssignmentCount(reviewerId: string): Promise<number> {
    return this.asignacionRepository.count({
      where: { revisor_id: reviewerId },
    });
  }

  private async fallbackRanking(
    tags: string[],
    revisores: User[],
  ): Promise<ReviewerSuggestion[]> {
    const suggestions: ReviewerSuggestion[] = await Promise.all(
      revisores.map(async (revisor) => {
        const especialidades = this.normalizeEspecialidades(
          revisor.perfil?.especialidades,
        );
        const matchCount = tags.filter((tag) =>
          especialidades.some(
            (esp) =>
              esp.toLowerCase().includes(tag.toLowerCase()) ||
              tag.toLowerCase().includes(esp.toLowerCase()),
          ),
        ).length;

        const asignacionesCount = await this.getReviewerAssignmentCount(revisor.id);

        return {
          reviewer_id: revisor.id,
          nombre: revisor.perfil?.nombre || revisor.nombre || revisor.email,
          email: revisor.email,
          especialidades,
          match_score: matchCount > 0 ? Math.min(matchCount * 20, 100) : 10,
          match_reason:
            matchCount > 0
              ? `${matchCount} especialidad(es) coincidente(s) con las etiquetas del artículo`
              : 'Revisor disponible (coincidencia por especialidades generales)',
          articulos_asignados: asignacionesCount,
          puede_recibir_mas: asignacionesCount < 3,
        };
      }),
    );

    return suggestions.sort((a, b) => b.match_score - a.match_score);
  }
}
