import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { AIController } from './ai.controller';
import { LLMService } from './services/llm.service';
import { PlagiarismService } from './services/plagiarism.service';
import { EthicsService } from './services/ethics.service';
import { EmbeddingService } from './services/embedding.service';
import { ReviewerSuggestionService } from './services/reviewer-suggestion.service';
import { AIConfig } from './entities/ai-config.entity';
import { ArticulosModule } from '../articulos/articulos.module';
import { UsersModule } from '../users/users.module';
import { CongresosModule } from '../congresos/congresos.module';
import { AsignacionesModule } from '../asignaciones/asignaciones.module';
import {
  ArticuloDetalle,
  ArticuloDetalleSchema,
} from '../articulos/schemas/articulo-detalle.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([AIConfig]),
    MongooseModule.forFeature([
      { name: ArticuloDetalle.name, schema: ArticuloDetalleSchema },
    ]),
    ArticulosModule,
    UsersModule,
    CongresosModule,
    AsignacionesModule,
  ],
  controllers: [AIController],
  providers: [LLMService, PlagiarismService, EthicsService, EmbeddingService, ReviewerSuggestionService],
  exports: [LLMService, PlagiarismService, EthicsService, EmbeddingService, ReviewerSuggestionService],
})
export class AIModule {}
