<template>
  <div id="app">
    <ToastContainer />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useTheme } from './composables/useTheme'
import { useSyncEngine } from './composables/useSyncEngine'
import { useToast } from './composables/useToast'
import ToastContainer from './components/ToastContainer.vue'

const { initTheme } = useTheme()
const syncEngine = useSyncEngine()
const { showToast } = useToast()
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

onMounted(() => {
  initTheme()

  // Registrar handler para revisiones
  syncEngine.registerHandler('REVISION', async (data) => {
    const response = await fetch(`${API_BASE_URL}/revisiones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error(`Error en el servidor: ${response.status}`)
    }

    showToast('Sincronización: Revisión enviada con éxito', 'success')
    return await response.json()
  })

  // Handler para iniciar revisión (cambio de estado automático)
  syncEngine.registerHandler('START_REVIEW', async (data) => {
    const response = await fetch(`${API_BASE_URL}/articulos/${data.articulo_id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: data.estado })
    })

    if (!response.ok) {
      throw new Error(`Error al actualizar estado: ${response.status}`)
    }

    console.log(`[SyncEngine] Artículo ${data.articulo_id} marcado como 'En Revisión'`)
    return await response.json()
  })

  // Intentar sincronizar cola pendiente al iniciar
  if (navigator.onLine) {
    syncEngine.syncAll()
  }
})
</script>