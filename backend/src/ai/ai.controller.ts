import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import * as path from 'path';
import { LLMService } from './services/llm.service';
import { PlagiarismService } from './services/plagiarism.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AIConfig } from './entities/ai-config.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ArticulosService } from '../articulos/articulos.service';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AIController {
  constructor(
    private readonly llmService: LLMService,
    private readonly plagiarismService: PlagiarismService,
    private readonly articulosService: ArticulosService,
    @InjectRepository(AIConfig)
    private readonly aiConfigRepository: Repository<AIConfig>,
  ) {}

  @Get('config')
  async getConfig() {
    let config = await this.aiConfigRepository.findOne({
      where: { isActive: true },
    });
    if (!config) {
      // Crear una configuración por defecto si no existe
      config = this.aiConfigRepository.create({
        isActive: true,
        provider: 'Gemini' as any,
        modelName: 'gemini-1.5-flash',
        apiKey: '',
      });
      await this.aiConfigRepository.save(config);
    }
    return config;
  }

  @Patch('config')
  async updateConfig(@Body() updateData: Partial<AIConfig>) {
    let config = await this.aiConfigRepository.findOne({
      where: { isActive: true },
    });
    if (!config) {
      config = this.aiConfigRepository.create({ isActive: true });
    }
    Object.assign(config, updateData);
    return this.aiConfigRepository.save(config);
  }

  @Post('check-plagiarism/:articuloId')
  async checkPlagiarism(@Param('articuloId') articuloId: string) {
    // 1. Obtener datos del artículo
    const articulo = await this.articulosService.findOne(articuloId);
    if (!articulo) {
      throw new NotFoundException('Artículo no encontrado');
    }

    // 2. Determinar la ruta del PDF
    // En el proyecto, los PDFs se guardan en backend/uploads/pdfs/
    // La pdf_url es algo como /uploads/pdfs/filename.pdf
    const pdfRelativePath = articulo.pdf_url.replace(
      /.*\/uploads\//,
      'uploads/',
    );
    const pdfPath = path.join(process.cwd(), pdfRelativePath);

    // 3. Ejecutar análisis
    const report = await this.plagiarismService.analyzeArticle(pdfPath);

    // 4. Guardar reporte en MongoDB (ArticuloDetalle)
    await this.articulosService.update(articuloId, {
      // @ts-ignore
      plagiarism_report: report,
    });

    return report;
  }
}

import * as path from 'path';
