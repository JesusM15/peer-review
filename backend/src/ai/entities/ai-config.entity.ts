import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum AIProvider {
  GEMINI = 'Gemini',
  GROQ = 'Groq',
  OLLAMA = 'Ollama',
}

@Entity('ai_configs')
export class AIConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, default: AIProvider.GEMINI })
  provider: AIProvider;

  @Column({ type: 'text', nullable: true })
  apiKey: string;

  @Column({ type: 'varchar', length: 100, default: 'gemini-1.5-flash' })
  modelName: string;

  @Column({ type: 'text', nullable: true })
  baseUrl: string; // Para Ollama o proxies

  @Column({ type: 'float', default: 0.7 })
  temperature: number;

  @Column({ type: 'int', default: 2048 })
  maxTokens: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
