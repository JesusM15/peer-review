export interface ReviewerSuggestion {
  reviewer_id: string;
  nombre: string;
  email: string;
  especialidades: string[];
  match_score: number;
  match_reason: string;
  articulos_asignados: number;
  puede_recibir_mas: boolean;
}
