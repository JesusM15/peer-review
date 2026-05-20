import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ArticuloDetalle,
  ArticuloDetalleDocument,
} from '../../articulos/schemas/articulo-detalle.schema';
import { AIConfig, AIProvider } from '../entities/ai-config.entity';

const DEFAULT_GEMINI_EMBEDDING_MODEL = 'text-embedding-004';

@Injectable()
export class EmbeddingService {
  constructor(
    @InjectRepository(AIConfig)
    private readonly aiConfigRepository: Repository<AIConfig>,
    @InjectModel(ArticuloDetalle.name)
    private readonly articuloDetalleModel: Model<ArticuloDetalleDocument>,
  ) {}

  async generateEmbedding(text: string): Promise<number[]> {
    const config = await this.aiConfigRepository.findOne({
      where: { isActive: true },
    });

    if (!config) {
      throw new InternalServerErrorException(
        'No se ha configurado ningún proveedor de IA activo.',
      );
    }

    if (config.provider !== AIProvider.GEMINI) {
      throw new InternalServerErrorException(
        `Embeddings solo soportados con Gemini. Provider actual: ${config.provider}.`,
      );
    }

    if (!config.apiKey) {
      throw new InternalServerErrorException(
        'API key de Gemini no configurada.',
      );
    }

    const truncated = text.substring(0, 9000);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_GEMINI_EMBEDDING_MODEL}:embedContent?key=${config.apiKey}`;

    const body = {
      model: `models/${DEFAULT_GEMINI_EMBEDDING_MODEL}`,
      content: { parts: [{ text: truncated }] },
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message || 'Error en Gemini embeddings');
      }
      const values: number[] | undefined = data?.embedding?.values;
      if (!Array.isArray(values) || values.length === 0) {
        throw new Error('Respuesta de embeddings vacía.');
      }
      return values;
    } catch (error: any) {
      console.error('[EmbeddingService] Error:', error);
      throw new InternalServerErrorException(
        `Error generando embedding: ${error.message}`,
      );
    }
  }

  cosineSimilarity(a: number[], b: number[]): number {
    if (a.length === 0 || b.length === 0 || a.length !== b.length) {
      return 0;
    }
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    const denom = Math.sqrt(normA) * Math.sqrt(normB);
    if (denom === 0) return 0;
    return dot / denom;
  }

  async findSimilar(
    excludeId: string,
    embedding: number[],
    topK = 5,
    threshold = 0,
  ): Promise<Array<{ articulo_id: string; similarity: number }>> {
    const detalles = await this.articuloDetalleModel
      .find({
        _id: { $ne: excludeId },
        embeddings: { $exists: true, $not: { $size: 0 } },
      })
      .select({ _id: 1, embeddings: 1 })
      .exec();

    const scored = detalles
      .map((d) => ({
        articulo_id: d._id as unknown as string,
        similarity: this.cosineSimilarity(embedding, d.embeddings || []),
      }))
      .filter((r) => r.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);

    return scored;
  }
}
