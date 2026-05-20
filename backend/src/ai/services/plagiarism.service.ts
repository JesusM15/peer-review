import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LLMService } from './llm.service';
import * as path from 'path';
import * as fs from 'fs';
// @ts-ignore
import * as pdf from 'pdf-parse';

@Injectable()
export class PlagiarismService {
  constructor(private readonly llmService: LLMService) {}

  async analyzeArticle(pdfPath: string): Promise<any> {
    try {
      // 1. Extraer texto del PDF
      const absolutePath = path.resolve(pdfPath);
      if (!fs.existsSync(absolutePath)) {
        throw new Error(`El archivo PDF no existe en la ruta: ${absolutePath}`);
      }

      const dataBuffer = fs.readFileSync(absolutePath);
      const pdfData = await pdf(dataBuffer);
      const text = pdfData.text;

      if (!text || text.trim().length < 100) {
        throw new Error('El PDF no contiene suficiente texto para analizar.');
      }

      // 2. Preparar el prompt
      const prompt = `Analiza el siguiente texto de un artículo de investigación para detectar posibles signos de plagio, uso no atribuido de fuentes o generación por IA.
      IMPORTANTE: Tu respuesta DEBE ser ÚNICAMENTE un objeto JSON válido.

      Texto del artículo:
      ${text.substring(0, 10000)} // Limitamos a 10k tokens aprox para evitar exceder límites si no es Gemini

      Responde con esta estructura JSON:
      {
        "score": number, // 0-100
        "summary": "string",
        "matches": [{ "text": "string", "reason": "string" }],
        "isAI": boolean,
        "confidence": "Baja" | "Media" | "Alta"
      }`;

      // 3. Llamar al LLM
      const response = await this.llmService.generateText(
        prompt,
        'Eres un experto en integridad académica y detección de plagio.',
      );

      // 4. Parsear respuesta
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        return JSON.parse(response);
      } catch (e) {
        console.error('Error parseando respuesta de IA:', response);
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
    } catch (error) {
      console.error('[PlagiarismService] Error:', error);
      throw new InternalServerErrorException(
        `Error en el análisis de plagio: ${error.message}`,
      );
    }
  }
}
