/**
 * Composable para manejar almacenamiento offline de PDFs y asignaciones
 * Usa IndexedDB para guardar archivos localmente
 */

const DB_NAME = 'peer_review_offline'
const DB_VERSION = 1
const STORE_PDFS = 'pdfs'
const STORE_ASSIGNMENTS = 'assignments'

interface StoredPdf {
  articuloId: string
  blob: Blob
  titulo: string
  downloadedAt: number
}

interface StoredAssignment {
  asignacionId: string
  articuloId: string
  titulo: string
  autorNombre: string
  fechaLimite: string
  estado: string
  synced: boolean
}

let db: IDBDatabase | null = null

async function initDB(): Promise<IDBDatabase> {
  if (db) return db

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      db = request.result
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result

      if (!database.objectStoreNames.contains(STORE_PDFS)) {
        const pdfStore = database.createObjectStore(STORE_PDFS, { keyPath: 'articuloId' })
        pdfStore.createIndex('downloadedAt', 'downloadedAt', { unique: false })
      }

      if (!database.objectStoreNames.contains(STORE_ASSIGNMENTS)) {
        const assignmentStore = database.createObjectStore(STORE_ASSIGNMENTS, { keyPath: 'asignacionId' })
        assignmentStore.createIndex('articuloId', 'articuloId', { unique: false })
        assignmentStore.createIndex('synced', 'synced', { unique: false })
      }
    }
  })
}

/**
 * Guarda un PDF en IndexedDB
 */
async function storePdf(articuloId: string, blob: Blob, titulo: string): Promise<void> {
  const database = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_PDFS], 'readwrite')
    const store = transaction.objectStore(STORE_PDFS)

    const data: StoredPdf = {
      articuloId,
      blob,
      titulo,
      downloadedAt: Date.now()
    }

    const request = store.put(data)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

/**
 * Obtiene un PDF de IndexedDB
 */
async function getPdf(articuloId: string): Promise<StoredPdf | null> {
  const database = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_PDFS], 'readonly')
    const store = transaction.objectStore(STORE_PDFS)
    const request = store.get(articuloId)

    request.onsuccess = () => {
      const result = request.result as StoredPdf | undefined
      resolve(result || null)
    }
    request.onerror = () => reject(request.error)
  })
}

/**
 * Elimina un PDF de IndexedDB
 */
async function deletePdf(articuloId: string): Promise<void> {
  const database = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_PDFS], 'readwrite')
    const store = transaction.objectStore(STORE_PDFS)
    const request = store.delete(articuloId)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

/**
 * Guarda información de asignación en IndexedDB
 */
async function storeAssignment(assignment: StoredAssignment): Promise<void> {
  const database = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_ASSIGNMENTS], 'readwrite')
    const store = transaction.objectStore(STORE_ASSIGNMENTS)
    const request = store.put(assignment)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

/**
 * Obtiene todas las asignaciones almacenadas
 */
async function getAllAssignments(): Promise<StoredAssignment[]> {
  const database = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_ASSIGNMENTS], 'readonly')
    const store = transaction.objectStore(STORE_ASSIGNMENTS)
    const request = store.getAll()

    request.onsuccess = () => resolve(request.result as StoredAssignment[])
    request.onerror = () => reject(request.error)
  })
}

/**
 * Elimina una asignación de IndexedDB
 */
async function deleteAssignment(asignacionId: string): Promise<void> {
  const database = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_ASSIGNMENTS], 'readwrite')
    const store = transaction.objectStore(STORE_ASSIGNMENTS)
    const request = store.delete(asignacionId)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

/**
 * Crea una URL blob para mostrar el PDF
 */
function createPdfUrl(blob: Blob): string {
  return URL.createObjectURL(blob)
}

/**
 * Revoca una URL blob para liberar memoria
 */
function revokePdfUrl(url: string): void {
  URL.revokeObjectURL(url)
}

/**
 * Verifica si hay conexión a internet (solo verifica red local)
 */
function isOnline(): boolean {
  return navigator.onLine
}

/**
 * Verifica si el backend está realmente accesible haciendo un ping
 */
async function checkBackendConnectivity(apiBaseUrl: string): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 seg timeout

    const response = await fetch(`${apiBaseUrl}/articulos`, {
      method: 'HEAD',
      signal: controller.signal
    })

    clearTimeout(timeoutId)
    return response.ok
  } catch (error) {
    return false
  }
}

/**
 * Verifica si está realmente offline (red o backend no disponible)
 */
async function isReallyOffline(apiBaseUrl: string): Promise<boolean> {
  // Si no hay red, definitivamente está offline
  if (!navigator.onLine) return true

  // Si hay red, verificar si el backend responde
  const backendAvailable = await checkBackendConnectivity(apiBaseUrl)
  return !backendAvailable
}

/**
 * Descarga y guarda un PDF desde el servidor
 */
async function downloadAndStorePdf(
  articuloId: string,
  titulo: string,
  apiBaseUrl: string
): Promise<boolean> {
  try {
    const url = `${apiBaseUrl}/articulos/${articuloId}/download`
    console.log(`[OfflineStorage] Descargando PDF desde: ${url}`)

    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include'
    })

    console.log(`[OfflineStorage] Respuesta: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error details')
      console.error('[OfflineStorage] Error descargando PDF:', response.status, errorText)
      return false
    }

    const contentType = response.headers.get('content-type')
    console.log(`[OfflineStorage] Content-Type: ${contentType}`)

    const blob = await response.blob()
    console.log(`[OfflineStorage] Blob recibido: ${blob.size} bytes`)

    if (blob.size === 0) {
      console.error('[OfflineStorage] Blob vacío, no se guardará')
      return false
    }

    await storePdf(articuloId, blob, titulo)
    console.log(`[OfflineStorage] PDF guardado localmente: ${titulo} (${blob.size} bytes)`)
    return true
  } catch (error) {
    console.error('[OfflineStorage] Error al descargar/guardar PDF:', error)
    return false
  }
}

/**
 * Limpia todos los datos offline
 */
async function clearAllOfflineData(): Promise<void> {
  const database = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_PDFS, STORE_ASSIGNMENTS], 'readwrite')
    
    transaction.objectStore(STORE_PDFS).clear()
    transaction.objectStore(STORE_ASSIGNMENTS).clear()

    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error)
  })
}

export function useOfflineStorage() {
  return {
    // PDF operations
    storePdf,
    getPdf,
    deletePdf,
    createPdfUrl,
    revokePdfUrl,
    downloadAndStorePdf,

    // Assignment operations
    storeAssignment,
    getAllAssignments,
    deleteAssignment,

    // Utilities
    isOnline,
    clearAllOfflineData,
    initDB
  }
}
