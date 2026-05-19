<template>
  <div class="selection-container" :class="{ 'dark': isDark }">
    <header class="selection-header">
      <div class="logo">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
        </svg>
        <span class="brand">Peer Review</span>
      </div>
      <div class="user-info">
        <span class="user-name">{{ authStore.user?.nombre }}</span>
        <button @click="logout" class="logout-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>
    </header>

    <main class="selection-content">
      <div class="content-header">
        <h1>Selecciona un Congreso</h1>
        <p>Continúa tu trabajo en uno de tus congresos o descubre nuevos eventos.</p>
      </div>

      <div class="search-container">
        <div class="search-input-wrapper">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Buscar congresos por nombre o especialidad..." 
            class="search-input"
          />
        </div>
      </div>

      <div class="tabs">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'mine' }"
          @click="activeTab = 'mine'"
        >
          Mis Congresos
          <span class="badge" v-if="myCongresses.length">{{ myCongresses.length }}</span>
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'discover' }"
          @click="activeTab = 'discover'"
        >
          Descubrir
        </button>
      </div>

      <div class="cards-grid">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
        </div>
        
        <div v-else-if="filteredCongresses.length === 0" class="empty-state">
          <p v-if="searchQuery">No se encontraron congresos que coincidan con "{{ searchQuery }}".</p>
          <p v-else-if="activeTab === 'mine'">No estás inscrito en ningún congreso todavía.</p>
          <button v-if="activeTab === 'mine' && !searchQuery" @click="activeTab = 'discover'" class="btn-primary">Explorar Congresos</button>
        </div>

        <div 
          v-else
          v-for="congreso in filteredCongresses" 
          :key="congreso.id" 
          class="congress-card"
          :class="{ 'is-new': activeTab === 'discover' }"
          @click="handleCardClick(congreso)"
        >
          <div class="card-image" :style="{ background: getRandomGradient() }">
            <div class="card-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
          </div>
          <div class="card-body">
            <h3>{{ congreso.nombre }}</h3>
            <p>{{ congreso.descripcion || 'Sin descripción disponible' }}</p>
            
            <div class="card-tags" v-if="congreso.tags && congreso.tags.length">
              <span v-for="tag in congreso.tags.slice(0, 3)" :key="tag.id" class="tag-pill">
                {{ tag.nombre }}
              </span>
              <span v-if="congreso.tags.length > 3" class="tag-more">+{{ congreso.tags.length - 3 }}</span>
            </div>

            <div class="card-footer">
              <span v-if="activeTab === 'mine'" class="role-badge">{{ getRoleInCongress(congreso.id) }}</span>
              <button 
                v-else 
                @click.stop="joinCongress(congreso)" 
                class="btn-join"
                :disabled="joiningId === congreso.id"
              >
                {{ joiningId === congreso.id ? 'Uniéndose...' : 'Unirse como Autor' }}
              </button>
              
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="arrow-icon">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCongressStore } from '../stores/congress'
import { useTheme } from '../composables/useTheme'

const router = useRouter()
const authStore = useAuthStore()
const congressStore = useCongressStore()
const { isDark } = useTheme()

const activeTab = ref('mine')
const loading = ref(false)
const searchQuery = ref('')
const joiningId = ref<string | null>(null)
const allCongresses = ref<any[]>([])

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

onMounted(async () => {
  if (!authStore.user) {
    router.push('/login')
    return
  }
  await loadData()
})

async function loadData() {
  loading.value = true
  try {
    await congressStore.fetchMemberships()
    const res = await fetch(`${API}/congresos`)
    allCongresses.value = await res.json()
  } catch (e) {
    console.error('Error cargando congresos', e)
  } finally {
    loading.value = false
  }
}

const myCongresses = computed(() => {
  const myIds = congressStore.memberships.map(m => m.congreso_id)
  return allCongresses.value.filter(c => myIds.includes(c.id))
})

const discoverCongresses = computed(() => {
  const myIds = congressStore.memberships.map(m => m.congreso_id)
  return allCongresses.value.filter(c => !myIds.includes(c.id))
})

const filteredCongresses = computed(() => {
  const source = activeTab.value === 'mine' ? myCongresses.value : discoverCongresses.value
  if (!searchQuery.value) return source
  
  const query = searchQuery.value.toLowerCase()
  return source.filter(c => 
    c.nombre.toLowerCase().includes(query) || 
    (c.descripcion && c.descripcion.toLowerCase().includes(query)) ||
    (c.tags && c.tags.some((t: any) => t.nombre.toLowerCase().includes(query)))
  )
})

function getRoleInCongress(congressId: string) {
  const membership = congressStore.memberships.find(m => m.congreso_id === congressId)
  return membership?.rol || 'Miembro'
}

async function handleCardClick(congreso: any) {
  const isMine = myCongresses.value.some(c => c.id === congreso.id)
  if (isMine) {
    await selectCongress(congreso)
  } else {
    // Si no es mío, el click en el card completo en "Descubrir" también podría iniciar el join
    // pero por ahora solo el botón join es explícito. 
    // Hagamos que el click en el card de descubrir también intente unirse.
    await joinCongress(congreso)
  }
}

async function selectCongress(congreso: any) {
  congressStore.setCongress(congreso.id)
  const role = getRoleInCongress(congreso.id)
  
  // Pequeño delay para asegurar que el store se actualice antes de la navegación
  await new Promise(resolve => setTimeout(resolve, 50));

  if (role === 'Admin' || authStore.user?.rol === 'Admin') {
    router.push('/admin')
  } else if (role === 'Editor') {
    router.push('/editor')
  } else if (role === 'Revisor') {
    router.push('/reviewer')
  } else if (role === 'Autor') {
    router.push('/author')
  } else {
    // Si no tiene rol pero está inscrito, por defecto es autor
    router.push('/author')
  }
}

async function joinCongress(congreso: any) {
  if (joiningId.value) return
  joiningId.value = congreso.id
  try {
    const res = await fetch(`${API}/congresos/${congreso.id}/join`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (res.ok) {
      await loadData()
      activeTab.value = 'mine'
      // Automáticamente seleccionar después de unirse
      const newCongreso = allCongresses.value.find(c => c.id === congreso.id)
      if (newCongreso) await selectCongress(newCongreso)
    }
  } catch (e) {
    console.error('Error al unirse al congreso', e)
  } finally {
    joiningId.value = null
  }
}

function logout() {
  authStore.logout()
  router.push('/login')
}

function getRandomGradient() {
  const gradients = [
    'linear-gradient(135deg, #000000 0%, #333333 100%)',
    'linear-gradient(135deg, #1a1a1a 0%, #444444 100%)',
    'linear-gradient(135deg, #2c2c2c 0%, #000000 100%)',
    'linear-gradient(135deg, #000000 0%, #111111 100%)'
  ]
  return gradients[Math.floor(Math.random() * gradients.length)]
}
</script>

<style scoped>
.selection-container {
  min-height: 100vh;
  background-color: #fff;
  color: #000;
  font-family: 'Inter', sans-serif;
  transition: background-color 0.3s ease;
}

.selection-container.dark {
  background-color: #000;
  color: #fff;
}

.selection-header {
  height: 64px;
  border-bottom: 1px solid #eaeaea;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  position: sticky;
  top: 0;
  z-index: 100;
}

.dark .selection-header {
  background-color: rgba(0, 0, 0, 0.8);
  border-bottom-color: #333;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-name {
  font-size: 0.85rem;
  font-weight: 500;
  color: #666;
}

.dark .user-name {
  color: #888;
}

.logout-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.4rem;
  color: #666;
  border-radius: 6px;
  display: flex;
  transition: all 0.2s;
}

.logout-btn:hover {
  background-color: #f5f5f5;
  color: #000;
}

.dark .logout-btn:hover {
  background-color: #111;
  color: #fff;
}

.selection-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}

.content-header {
  margin-bottom: 2rem;
}

.content-header h1 {
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -0.05em;
  margin-bottom: 0.5rem;
}

.content-header p {
  color: #666;
  font-size: 1rem;
}

.dark .content-header p {
  color: #888;
}

.search-container {
  margin-bottom: 2rem;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  color: #888;
}

.search-input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 3rem;
  border: 1px solid #eaeaea;
  border-radius: 10px;
  font-size: 0.95rem;
  background-color: #fff;
  color: #000;
  transition: all 0.2s;
}

.dark .search-input {
  background-color: #111;
  border-color: #333;
  color: #fff;
}

.search-input:focus {
  outline: none;
  border-color: #000;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.05);
}

.dark .search-input:focus {
  border-color: #fff;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
}

.tabs {
  display: flex;
  gap: 1.5rem;
  border-bottom: 1px solid #eaeaea;
  margin-bottom: 2.5rem;
}

.dark .tabs {
  border-bottom-color: #333;
}

.tab-btn {
  background: none;
  border: none;
  padding: 0.75rem 0.25rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
}

.tab-btn.active {
  color: #000;
  font-weight: 600;
}

.dark .tab-btn.active {
  color: #fff;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #000;
}

.dark .tab-btn.active::after {
  background-color: #fff;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.congress-card {
  background-color: #fff;
  border: 1px solid #eaeaea;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  min-height: 400px; /* Mas alto */
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.dark .congress-card {
  background-color: #000;
  border-color: #333;
}

.congress-card:hover {
  transform: translateY(-8px);
  border-color: #000;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
}

.dark .congress-card:hover {
  border-color: #fff;
  box-shadow: 0 20px 40px rgba(255, 255, 255, 0.1);
}

.card-image {
  height: 160px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.card-icon {
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 12px;
  backdrop-filter: blur(4px);
}

.card-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.card-body h3 {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  letter-spacing: -0.02em;
}

.card-body p {
  font-size: 0.85rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex-grow: 1;
}

.dark .card-body p {
  color: #999;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tag-pill {
  font-size: 0.7rem;
  background-color: #f5f5f5;
  color: #666;
  padding: 0.2rem 0.6rem;
  border-radius: 100px;
  font-weight: 500;
}

.dark .tag-pill {
  background-color: #111;
  color: #999;
}

.tag-more {
  font-size: 0.7rem;
  color: #999;
  align-self: center;
}

.card-footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid #f5f5f5;
}

.dark .card-footer {
  border-top-color: #111;
}

.role-badge {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #999;
  letter-spacing: 0.05em;
}

.btn-join {
  background-color: #000;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.dark .btn-join {
  background-color: #fff;
  color: #000;
}

.arrow-icon {
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
  color: #000;
}

.dark .arrow-icon {
  color: #fff;
}

.congress-card:hover .arrow-icon {
  opacity: 1;
  transform: translateX(0);
}

.loading-state {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  padding: 4rem;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #eaeaea;
  border-top-color: #000;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.dark .spinner {
  border-color: #222;
  border-top-color: #fff;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.badge {
  background-color: #f0f0f0;
  padding: 0.1rem 0.4rem;
  border-radius: 6px;
  font-size: 0.7rem;
  margin-left: 0.4rem;
}

.dark .badge {
  background-color: #111;
  color: #888;
}
</style>
