import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { PDFParse } from 'pdf-parse';
import { LLMService } from './llm.service';

export interface EthicsAlert {
  type:
    | 'consentimiento_informado'
    | 'datos_personales'
    | 'afirmaciones_no_respaldadas'
    | 'conflicto_de_intereses'
    | 'otro';
  severity: 'baja' | 'media' | 'alta';
  description: string;
  evidence?: string;
}

export interface EthicsReport {
  overall_risk: 'bajo' | 'medio' | 'alto';
  summary: string;
  alerts: EthicsAlert[];
}

const SYSTEM_INSTRUCTION =
  'Eres un experto en ética de la investigación científica revisando artículos para detectar problemas éticos comunes en publicaciones académicas.';

@Injectable()
export class EthicsService {
  constructor(private readonly llmService: LLMService) {}

  async analyzeArticle(pdfPath: string): Promise<EthicsReport> {
    try {
      const absolutePath = path.resolve(pdfPath);
      if (!fs.existsSync(absolutePath)) {
        throw new Error(`El archivo PDF no existe en la ruta: ${absolutePath}`);
      }

      const dataBuffer = fs.readFileSync(absolutePath);
      const parser = new PDFParse({ data: new Uint8Array(dataBuffer) });
      let text: string;
      try {
        const pdfData = await parser.getText();
        text = pdfData.text;
      } finally {
        await parser.destroy();
      }

      if (!text || text.trim().length < 100) {
        throw new Error(
          'El PDF no contiene suficiente texto para analizar éticamente.',
        );
      }

      return this.analyzeText(text);
    } catch (error: any) {
      console.error('[EthicsService] Error:', error);
      throw new InternalServerErrorException(
        `Error en el análisis ético: ${error.message}`,
      );
    }
  }

  async analyzeText(text: string): Promise<EthicsReport> {
    const truncated = text.substring(0, 10000);

    const prompt = `Analiza el siguiente artículo de investigación y genera un reporte de alertas tempranas para el editor. Identifica problemas éticos en estas categorías:

1. consentimiento_informado: el artículo involucra sujetos humanos sin mencionar consentimiento informado o aprobación de un comité de ética.
2. datos_personales: tratamiento de datos personales identificables sin mencionar anonimización ni cumplimiento de protección de datos.
3. afirmaciones_no_respaldadas: conclusiones o afirmaciones fuertes que no están respaldadas por los resultados o evidencia presentada en el texto.
4. conflicto_de_intereses: posibles conflictos de intereses no declarados.
5. otro: cualquier otro problema ético relevante.

IMPORTANTE: Tu respuesta DEBE ser ÚNICAMENTE un objeto JSON válido, sin texto adicional ni markdown.

Estructura JSON requerida:
{
  "overall_risk": "bajo" | "medio" | "alto",
  "summary": "string corto en español describiendo el nivel general de riesgo ético",
  "alerts": [
    {
      "type": "consentimiento_informado" | "datos_personales" | "afirmaciones_no_respaldadas" | "conflicto_de_intereses" | "otro",
      "severity": "baja" | "media" | "alta",
      "description": "string en español describiendo el problema",
      "evidence": "string opcional con la cita o ubicación aproximada del problema"
    }
  ]
}

Si no encuentras problemas, devuelve un array vacío en "alerts" y overall_risk "bajo".

Texto del artículo:
${truncated}`;

    const response = await this.llmService.generateText(
      prompt,
      SYSTEM_INSTRUCTION,
    );

    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const raw = jsonMatch ? jsonMatch[0] : response;
      const parsed = JSON.parse(raw) as EthicsReport;
      if (!parsed.alerts || !Array.isArray(parsed.alerts)) {
        parsed.alerts = [];
      }
      if (!parsed.overall_risk) {
        parsed.overall_risk = 'bajo';
      }
      if (!parsed.summary) {
        parsed.summary = '';
      }
      return parsed;
    } catch (e) {
      console.error('[EthicsService] Error parseando respuesta:', response);
      return {
        overall_risk: 'bajo',
        summary:
          'Error al procesar la respuesta de la IA. Respuesta original: ' +
          response.substring(0, 200),
        alerts: [],
      };
    }
  }
}
