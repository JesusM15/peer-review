import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AIConfig, AIProvider } from '../entities/ai-config.entity';

@Injectable()
export class LLMService {
  constructor(
    @InjectRepository(AIConfig)
    private readonly aiConfigRepository: Repository<AIConfig>,
  ) {}

  async getActiveConfig(): Promise<AIConfig> {
    const config = await this.aiConfigRepository.findOne({
      where: { isActive: true },
    });
    if (!config) {
      throw new InternalServerErrorException(
        'No se ha configurado ningún proveedor de IA activo.',
      );
    }
    return config;
  }

  async generateText(
    prompt: string,
    systemInstruction?: string,
  ): Promise<string> {
    const config = await this.getActiveConfig();

    switch (config.provider) {
      case AIProvider.GEMINI:
        return this.callGemini(config, prompt, systemInstruction);
      case AIProvider.GROQ:
        return this.callGroq(config, prompt, systemInstruction);
      case AIProvider.OLLAMA:
        return this.callOllama(config, prompt, systemInstruction);
      default:
        throw new InternalServerErrorException(
          `Proveedor ${config.provider} no soportado.`,
        );
    }
  }

  private async callGemini(
    config: AIConfig,
    prompt: string,
    systemInstruction?: string,
  ): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.modelName}:generateContent?key=${config.apiKey}`;

    const body = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text:
                (systemInstruction ? `${systemInstruction}\n\n` : '') + prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: config.temperature,
        maxOutputTokens: config.maxTokens,
      },
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message || 'Error en Gemini API');
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('[GeminiService] Error:', error);
      throw new InternalServerErrorException(
        `Error llamando a Gemini: ${error.message}`,
      );
    }
  }

  private async callGroq(
    config: AIConfig,
    prompt: string,
    systemInstruction?: string,
  ): Promise<string> {
    const url = 'https://api.groq.com/openai/v1/chat/completions';

    const body = {
      model: config.modelName || 'llama3-8b-8192',
      messages: [
        ...(systemInstruction
          ? [{ role: 'system', content: systemInstruction }]
          : []),
        { role: 'user', content: prompt },
      ],
      temperature: config.temperature,
      max_tokens: config.maxTokens,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      return data.choices[0].message.content;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error llamando a Groq: ${error.message}`,
      );
    }
  }

  private async callOllama(
    config: AIConfig,
    prompt: string,
    systemInstruction?: string,
  ): Promise<string> {
    const url = `${config.baseUrl || 'http://localhost:11434'}/api/generate`;

    const body = {
      model: config.modelName || 'llama3',
      prompt: (systemInstruction ? `${systemInstruction}\n\n` : '') + prompt,
      stream: false,
      options: {
        temperature: config.temperature,
        num_predict: config.maxTokens,
      },
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      return data.response;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error llamando a Ollama: ${error.message}`,
      );
    }
  }
}
