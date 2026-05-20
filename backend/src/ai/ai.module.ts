import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { AIController } from './ai.controller';
import { LLMService } from './services/llm.service';
import { PlagiarismService } from './services/plagiarism.service';
import { EthicsService } from './services/ethics.service';
import { EmbeddingService } from './services/embedding.service';
import { AIConfig } from './entities/ai-config.entity';
import { ArticulosModule } from '../articulos/articulos.module';
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
  ],
  controllers: [AIController],
  providers: [LLMService, PlagiarismService, EthicsService, EmbeddingService],
  exports: [LLMService, PlagiarismService, EthicsService, EmbeddingService],
})
export class AIModule {}
