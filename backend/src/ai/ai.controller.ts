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
import { EthicsService } from './services/ethics.service';
import { EmbeddingService } from './services/embedding.service';
import { ReviewerSuggestionService } from './services/reviewer-suggestion.service';
import { ReviewerSuggestion } from './dto/reviewer-suggestion.dto';
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
    private readonly ethicsService: EthicsService,
    private readonly embeddingService: EmbeddingService,
    private readonly reviewerSuggestionService: ReviewerSuggestionService,
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
    console.log('[AIController] updateConfig called with:', updateData);
    try {
      let config = await this.aiConfigRepository.findOne({
        where: { isActive: true },
      });
      console.log('[AIController] Existing config:', config);
      if (!config) {
        config = this.aiConfigRepository.create({ isActive: true });
        console.log('[AIController] Created new config');
      }
      Object.assign(config, updateData);
      const result = await this.aiConfigRepository.save(config);
      console.log('[AIController] Config saved successfully:', result);
      return result;
    } catch (error) {
      console.error('[AIController] Error saving config:', error);
      throw error;
    }
  }

  @Post('check-plagiarism/:articuloId')
  async checkPlagiarism(@Param('articuloId') articuloId: string) {
    const pdfPath = await this.resolvePdfPath(articuloId);
    const report = await this.plagiarismService.analyzeArticle(pdfPath);

    await this.articulosService.update(articuloId, {
      plagiarism_report: report,
    });

    return report;
  }

  @Post('check-plagiarism-similarity/:articuloId')
  async checkPlagiarismSimilarity(
    @Param('articuloId') articuloId: string,
    @Body() body: { topK?: number; threshold?: number } = {},
  ) {
    const pdfPath = await this.resolvePdfPath(articuloId);
    const text = await this.plagiarismService.extractPdfText(pdfPath);

    const result = await this.plagiarismService.analyzeSimilarity(
      articuloId,
      text,
      { topK: body.topK, threshold: body.threshold },
    );

    await this.articulosService.update(articuloId, {
      embeddings: result.embedding,
    });

    return {
      query_articulo_id: result.query_articulo_id,
      threshold: result.threshold,
      hits: result.hits,
    };
  }

  @Post('ethics-report/:articuloId')
  async ethicsReport(@Param('articuloId') articuloId: string) {
    const pdfPath = await this.resolvePdfPath(articuloId);
    const report = await this.ethicsService.analyzeArticle(pdfPath);

    await this.articulosService.update(articuloId, {
      ethics_report: report,
    });

    return report;
  }

  @Post('full-analysis/:articuloId')
  async fullAnalysis(
    @Param('articuloId') articuloId: string,
    @Body() body: { topK?: number; threshold?: number } = {},
  ) {
    console.log('[AIController] fullAnalysis called for articuloId:', articuloId);
    try {
      const pdfPath = await this.resolvePdfPath(articuloId);
      console.log('[AIController] PDF path resolved:', pdfPath);
      const text = await this.plagiarismService.extractPdfText(pdfPath);
      console.log('[AIController] Text extracted, length:', text.length);

      const [plagiarism, ethics, similarity] = await Promise.all([
        this.plagiarismService.analyzeText(text),
        this.ethicsService.analyzeText(text),
        this.plagiarismService.analyzeSimilarity(articuloId, text, {
          topK: body.topK,
          threshold: body.threshold,
        }),
      ]);

      console.log('[AIController] Analysis completed');

      await this.articulosService.update(articuloId, {
        plagiarism_report: plagiarism,
        ethics_report: ethics,
        embeddings: similarity.embedding,
      });

      return {
        plagiarism_report: plagiarism,
        ethics_report: ethics,
        similarity: {
          query_articulo_id: similarity.query_articulo_id,
          threshold: similarity.threshold,
          hits: similarity.hits,
        },
      };
    } catch (error) {
      console.error('[AIController] Error in fullAnalysis:', error);
      throw error;
    }
  }

  @Post('suggest-reviewers/:articuloId')
  async suggestReviewers(@Param('articuloId') articuloId: string) {
    console.log('[AIController] suggestReviewers called for articuloId:', articuloId);
    try {
      const suggestions = await this.reviewerSuggestionService.suggestReviewers(
        articuloId,
      );
      console.log('[AIController] Reviewer suggestions generated:', suggestions.length);
      return suggestions;
    } catch (error) {
      console.error('[AIController] Error in suggestReviewers:', error);
      throw error;
    }
  }

  private async resolvePdfPath(articuloId: string): Promise<string> {
    const articulo = await this.articulosService.findOne(articuloId);
    if (!articulo) {
      throw new NotFoundException('Artículo no encontrado');
    }
    if (!articulo.pdf_url) {
      throw new NotFoundException(
        'El artículo no tiene un PDF asociado para analizar.',
      );
    }

    const pdfRelativePath = articulo.pdf_url.replace(
      /.*\/uploads\//,
      'uploads/',
    );
    return path.join(process.cwd(), pdfRelativePath);
  }
}
