import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from './auth';

export const useAIStore = defineStore('ai', () => {
  const authStore = useAuthStore();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  const config = ref({
    provider: 'Gemini',
    apiKey: '',
    modelName: 'gemini-1.5-flash',
    baseUrl: '',
    temperature: 0.7,
    maxTokens: 2048,
    isActive: true,
  });

  const loading = ref(false);

  const authHeaders = (extra: Record<string, string> = {}) => {
    const headers = {
      Authorization: `Bearer ${authStore.token}`,
      ...extra,
    };
    console.log('[AI Store] Auth headers:', headers);
    console.log('[AI Store] Token exists:', !!authStore.token);
    console.log('[AI Store] Token value:', authStore.token ? authStore.token.substring(0, 20) + '...' : 'null');
    return headers;
  };

  const fetchConfig = async () => {
    loading.value = true;
    try {
      const response = await fetch(`${API_URL}/ai/config`, {
        headers: authHeaders(),
      });
      if (response.ok) {
        config.value = await response.json();
      }
    } catch (error) {
      console.error('Error fetching AI config:', error);
    } finally {
      loading.value = false;
    }
  };

  const updateConfig = async (newConfig: any) => {
    loading.value = true;
    try {
      console.log('[AI Store] Updating config with:', newConfig);
      console.log('[AI Store] API URL:', API_URL);
      const response = await fetch(`${API_URL}/ai/config`, {
        method: 'PATCH',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(newConfig),
      });
      console.log('[AI Store] Response status:', response.status);
      if (response.ok) {
        config.value = await response.json();
        console.log('[AI Store] Config updated successfully');
        return true;
      }
      const errorText = await response.text();
      console.error('[AI Store] Response not ok:', response.status, errorText);
      return false;
    } catch (error) {
      console.error('[AI Store] Error updating AI config:', error);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const checkPlagiarism = async (articuloId: string) => {
    loading.value = true;
    try {
      const response = await fetch(
        `${API_URL}/ai/check-plagiarism/${articuloId}`,
        {
          method: 'POST',
          headers: authHeaders(),
        },
      );
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Error en el análisis de plagio');
    } catch (error) {
      console.error('Error checking plagiarism:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const checkPlagiarismSimilarity = async (
    articuloId: string,
    options: { topK?: number; threshold?: number } = {},
  ) => {
    loading.value = true;
    try {
      const response = await fetch(
        `${API_URL}/ai/check-plagiarism-similarity/${articuloId}`,
        {
          method: 'POST',
          headers: authHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify(options),
        },
      );
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Error en el análisis de similitud');
    } catch (error) {
      console.error('Error checking similarity:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const ethicsReport = async (articuloId: string) => {
    loading.value = true;
    try {
      const response = await fetch(
        `${API_URL}/ai/ethics-report/${articuloId}`,
        {
          method: 'POST',
          headers: authHeaders(),
        },
      );
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Error en el reporte de alertas éticas');
    } catch (error) {
      console.error('Error generating ethics report:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const fullAnalysis = async (
    articuloId: string,
    options: { topK?: number; threshold?: number } = {},
  ) => {
    loading.value = true;
    try {
      const response = await fetch(
        `${API_URL}/ai/full-analysis/${articuloId}`,
        {
          method: 'POST',
          headers: authHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify(options),
        },
      );
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Error en el análisis completo');
    } catch (error) {
      console.error('Error running full analysis:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  return {
    config,
    loading,
    fetchConfig,
    updateConfig,
    checkPlagiarism,
    checkPlagiarismSimilarity,
    ethicsReport,
    fullAnalysis,
  };
});
