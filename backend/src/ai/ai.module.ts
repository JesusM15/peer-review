import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AIController } from './ai.controller';
import { LLMService } from './services/llm.service';
import { PlagiarismService } from './services/plagiarism.service';
import { AIConfig } from './entities/ai-config.entity';
import { ArticulosModule } from '../articulos/articulos.module';

@Module({
  imports: [TypeOrmModule.forFeature([AIConfig]), ArticulosModule],
  controllers: [AIController],
  providers: [LLMService, PlagiarismService],
  exports: [LLMService, PlagiarismService],
})
export class AIModule {}
