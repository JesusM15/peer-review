/**
 * Motor de Sincronización Offline
 * Gestiona una cola de acciones pendientes en IndexedDB y las procesa cuando hay conexión.
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { useOfflineStorage } from './useOfflineStorage'

const DB_NAME = 'peer_review_offline'
const STORE_SYNC_QUEUE = 'sync_queue'

export interface SyncAction {
  id: string
  type: string
  payload: any
  timestamp: number
  status: 'pending' | 'syncing' | 'failed'
  attempts: number
  error?: string
}

type SyncHandler = (payload: any) => Promise<any>

const handlers: Record<string, SyncHandler> = {}
const isSyncing = ref(false)
const pendingCount = ref(0)

export function useSyncEngine() {
  const offlineStorage = useOfflineStorage()

  /**
   * Registra un manejador para un tipo de acción específico
   */
  const registerHandler = (type: string, handler: SyncHandler) => {
    handlers[type] = handler
    console.log(`[SyncEngine] Handler registrado para: ${type}`)
  }

  /**
   * Añade una acción a la cola de sincronización
   */
  const enqueue = async (type: string, payload: any) => {
    const db = await offlineStorage.initDB()
    const action: SyncAction = {
      id: crypto.randomUUID(),
      type,
      payload: JSON.parse(JSON.stringify(payload)), // Clonado profundo para evitar errores de Proxy
      timestamp: Date.now(),
      status: 'pending',
      attempts: 0
    }

    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([STORE_SYNC_QUEUE], 'readwrite')
      const store = transaction.objectStore(STORE_SYNC_QUEUE)
      const request = store.add(action)

      request.onsuccess = () => {
        console.log(`[SyncEngine] Acción encolada: ${type} (${action.id})`)
        updatePendingCount()
        // Intentar sincronizar inmediatamente si hay conexión
        if (navigator.onLine) {
          syncAll()
        }
        resolve()
      }
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Procesa toda la cola de sincronización
   */
  const syncAll = async () => {
    if (isSyncing.value || !navigator.onLine) return
    
    const db = await offlineStorage.initDB()
    const transaction = db.transaction([STORE_SYNC_QUEUE], 'readonly')
    const store = transaction.objectStore(STORE_SYNC_QUEUE)
    const request = store.getAll()

    request.onsuccess = async () => {
      const actions = (request.result as SyncAction[]).filter(a => a.status !== 'syncing')
      if (actions.length === 0) {
        updatePendingCount()
        return
      }

      console.log(`[SyncEngine] Iniciando sincronización de ${actions.length} acciones...`)
      isSyncing.value = true

      // Procesar en orden cronológico (FIFO)
      const sortedActions = actions.sort((a, b) => a.timestamp - b.timestamp)

      for (const action of sortedActions) {
        await processAction(action)
      }

      isSyncing.value = false
      updatePendingCount()
      console.log(`[SyncEngine] Sincronización completada.`)
    }
  }

  /**
   * Procesa una única acción
   */
  const processAction = async (action: SyncAction) => {
    const handler = handlers[action.type]
    if (!handler) {
      console.warn(`[SyncEngine] No hay handler registrado para el tipo: ${action.type}`)
      return
    }

    const db = await offlineStorage.initDB()
    
    // Marcar como 'syncing'
    await updateActionStatus(action.id, 'syncing')

    try {
      console.log(`[SyncEngine] Sincronizando ${action.type} (${action.id})...`)
      await handler(action.payload)
      
      // Éxito: Eliminar de la cola
      await deleteAction(action.id)
      console.log(`[SyncEngine] ✅ Acción completada y eliminada: ${action.id}`)
    } catch (error: any) {
      console.error(`[SyncEngine] ❌ Error sincronizando ${action.id}:`, error)
      
      // Fallo: Actualizar con error y reintento
      await updateActionStatus(action.id, 'failed', error.message || String(error), action.attempts + 1)
    }
  }

  const updateActionStatus = async (id: string, status: SyncAction['status'], error?: string, attempts?: number) => {
    const db = await offlineStorage.initDB()
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([STORE_SYNC_QUEUE], 'readwrite')
      const store = transaction.objectStore(STORE_SYNC_QUEUE)
      
      const getReq = store.get(id)
      getReq.onsuccess = () => {
        const data = getReq.result as SyncAction
        if (data) {
          data.status = status
          if (error) data.error = error
          if (attempts !== undefined) data.attempts = attempts
          store.put(data)
        }
        resolve()
      }
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
    })
  }

  const deleteAction = async (id: string) => {
    const db = await offlineStorage.initDB()
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([STORE_SYNC_QUEUE], 'readwrite')
      const store = transaction.objectStore(STORE_SYNC_QUEUE)
      const request = store.delete(id)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  const updatePendingCount = async () => {
    try {
      const db = await offlineStorage.initDB()
      const transaction = db.transaction([STORE_SYNC_QUEUE], 'readonly')
      const store = transaction.objectStore(STORE_SYNC_QUEUE)
      const request = store.count()
      request.onsuccess = () => {
        pendingCount.value = request.result
      }
    } catch (e) {
      // Ignorar errores al inicio
    }
  }

  // Listener para eventos de red
  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
      console.log('[SyncEngine] Conexión recuperada. Intentando sincronizar...')
      syncAll()
    })
  }

  return {
    enqueue,
    registerHandler,
    syncAll,
    isSyncing,
    pendingCount,
    updatePendingCount
  }
}
