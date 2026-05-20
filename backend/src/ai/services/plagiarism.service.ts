import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { PDFParse } from 'pdf-parse';
import { LLMService } from './llm.service';
import { EmbeddingService } from './embedding.service';

export interface PlagiarismMatch {
  text: string;
  reason: string;
}

export interface PlagiarismReport {
  score: number;
  summary: string;
  matches: PlagiarismMatch[];
  isAI: boolean;
  confidence: 'Baja' | 'Media' | 'Alta';
}

export interface SimilarArticleHit {
  articulo_id: string;
  similarity: number;
}

export interface SimilarityReport {
  query_articulo_id: string;
  embedding_generated: boolean;
  threshold: number;
  hits: SimilarArticleHit[];
}

const PLAGIARISM_SYSTEM_INSTRUCTION =
  'Eres un experto en integridad académica y detección de plagio.';

@Injectable()
export class PlagiarismService {
  constructor(
    private readonly llmService: LLMService,
    private readonly embeddingService: EmbeddingService,
  ) {}

  async extractPdfText(pdfPath: string): Promise<string> {
    const absolutePath = path.resolve(pdfPath);
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`El archivo PDF no existe en la ruta: ${absolutePath}`);
    }
    const dataBuffer = fs.readFileSync(absolutePath);
    const parser = new PDFParse({ data: new Uint8Array(dataBuffer) });
    try {
      const pdfData = await parser.getText();
      const text: string = pdfData.text;
      if (!text || text.trim().length < 100) {
        throw new Error(
          'El PDF no contiene suficiente texto para analizar.',
        );
      }
      return text;
    } finally {
      await parser.destroy();
    }
  }

  async analyzeArticle(pdfPath: string): Promise<PlagiarismReport> {
    try {
      const text = await this.extractPdfText(pdfPath);
      return this.analyzeText(text);
    } catch (error: any) {
      console.error('[PlagiarismService] Error:', error);
      throw new InternalServerErrorException(
        `Error en el análisis de plagio: ${error.message}`,
      );
    }
  }

  async analyzeText(text: string): Promise<PlagiarismReport> {
    const prompt = `Analiza el siguiente texto de un artículo de investigación para detectar posibles signos de plagio, uso no atribuido de fuentes o generación por IA.
IMPORTANTE: Tu respuesta DEBE ser ÚNICAMENTE un objeto JSON válido, sin texto adicional ni markdown.

Texto del artículo:
${text.substring(0, 10000)}

Responde con esta estructura JSON:
{
  "score": number,
  "summary": "string",
  "matches": [{ "text": "string", "reason": "string" }],
  "isAI": boolean,
  "confidence": "Baja" | "Media" | "Alta"
}`;

    const response = await this.llmService.generateText(
      prompt,
      PLAGIARISM_SYSTEM_INSTRUCTION,
    );

    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const raw = jsonMatch ? jsonMatch[0] : response;
      return JSON.parse(raw) as PlagiarismReport;
    } catch (e) {
      console.error('[PlagiarismService] Error parseando respuesta:', response);
      return {
        score: 0,
        summary:
          'Error al procesar la respuesta de la IA. La respuesta original fue: ' +
          response.substring(0, 200),
        matches: [],
        isAI: false,
        confidence: 'Baja',
      };
    }
  }

  async analyzeSimilarity(
    articuloId: string,
    text: string,
    options: { topK?: number; threshold?: number } = {},
  ): Promise<SimilarityReport & { embedding: number[] }> {
    const topK = options.topK ?? 5;
    const threshold = options.threshold ?? 0;

    const embedding = await this.embeddingService.generateEmbedding(text);
    const hits = await this.embeddingService.findSimilar(
      articuloId,
      embedding,
      topK,
      threshold,
    );

    return {
      query_articulo_id: articuloId,
      embedding_generated: true,
      threshold,
      hits,
      embedding,
    };
  }
}
