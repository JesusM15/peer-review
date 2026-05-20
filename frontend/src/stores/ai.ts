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
    isActive: true
  });

  const loading = ref(false);

  const fetchConfig = async () => {
    loading.ref = true;
    try {
      const response = await fetch(`${API_URL}/ai/config`, {
        headers: { 'Authorization': `Bearer ${authStore.token}` }
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
      const response = await fetch(`${API_URL}/ai/config`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`
        },
        body: JSON.stringify(newConfig)
      });
      if (response.ok) {
        config.value = await response.json();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating AI config:', error);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const checkPlagiarism = async (articuloId: string) => {
    loading.value = true;
    try {
      const response = await fetch(`${API_URL}/ai/check-plagiarism/${articuloId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authStore.token}` }
      });
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

  return {
    config,
    loading,
    fetchConfig,
    updateConfig,
    checkPlagiarism
  };
});
