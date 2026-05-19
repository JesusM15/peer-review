import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useOfflineStorage } from '../composables/useOfflineStorage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface Congreso {
  id: string;
  nombre: string;
  descripcion: string;
}

interface Membership {
  id: string;
  congreso_id: string;
  rol: string;
  congreso: Congreso;
}

export const useCongressStore = defineStore('congress', () => {
  const currentCongressId = ref<string | null>(localStorage.getItem('currentCongressId'));
  const memberships = ref<Membership[]>([]);
  const loading = ref(false);

  const currentMembership = computed(() => 
    memberships.value.find(m => m.congreso_id === currentCongressId.value) || null
  );

  const currentRole = computed(() => currentMembership.value?.rol || null);

  const setCongress = (id: string) => {
    currentCongressId.value = id;
    localStorage.setItem('currentCongressId', id);
  };

  const fetchMemberships = async () => {
    loading.value = true;
    const offlineStorage = useOfflineStorage();
    try {
      if (!offlineStorage.isOnline()) {
        memberships.value = await offlineStorage.getMemberships();
        if (!currentCongressId.value && memberships.value.length > 0) {
          setCongress(memberships.value[0].congreso_id);
        }
        loading.value = false;
        return;
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/congresos/my-memberships`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        memberships.value = await response.json();
        await offlineStorage.storeMemberships(JSON.parse(JSON.stringify(memberships.value)));
        // Si no hay congreso seleccionado, seleccionar el primero
        if (!currentCongressId.value && memberships.value.length > 0) {
          setCongress(memberships.value[0].congreso_id);
        }
      } else {
        memberships.value = await offlineStorage.getMemberships();
      }
    } catch (e) {
      console.error('Error fetching memberships, using offline fallback', e);
      memberships.value = await offlineStorage.getMemberships();
    } finally {
      loading.value = false;
    }
  };

  return {
    currentCongressId,
    memberships,
    loading,
    currentMembership,
    currentRole,
    setCongress,
    fetchMemberships,
  };
});
