<script setup lang="ts">
import { useCongressStore } from '../stores/congress';
import { onMounted } from 'vue';

const congressStore = useCongressStore();

onMounted(() => {
  if (congressStore.memberships.length === 0) {
    congressStore.fetchMemberships();
  }
});

const handleSelect = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  congressStore.setCongress(target.value);
};
</script>

<template>
  <div class="congress-selector-container">
    <label for="congress-select" class="selector-label">Congreso Activo</label>
    <div class="select-wrapper">
      <select 
        id="congress-select" 
        :value="congressStore.currentCongressId" 
        @change="handleSelect"
        class="premium-select"
      >
        <option v-for="membership in congressStore.memberships" :key="membership.id" :value="membership.congreso_id">
          {{ membership.congreso.nombre }} ({{ membership.rol }})
        </option>
      </select>
      <div class="select-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.congress-selector-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  width: 100%;
  max-width: 300px;
}

.selector-label {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
}

.select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.premium-select {
  appearance: none;
  width: 100%;
  padding: 0.75rem 1rem;
  padding-right: 2.5rem;
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.premium-select:hover {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(30, 41, 59, 0.9);
}

.premium-select:focus {
  outline: none;
  border-color: #38bdf8;
  box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2);
}

.select-icon {
  position: absolute;
  right: 1rem;
  pointer-events: none;
  color: #38bdf8;
  display: flex;
  align-items: center;
}

option {
  background: #0f172a;
  color: white;
}
</style>
