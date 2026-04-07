import { ref } from 'vue'

export interface Toast {
    id: number
    message: string
    type: 'success' | 'error' | 'info'
    duration: number
}

// Las alertas (toasts) deben compartirse de manera global en todo el estado de la aplicación
const toasts = ref<Toast[]>([])
let nextId = 0

export function useToast() {
    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info', duration: number = 3000) => {
        const id = nextId++
        toasts.value.push({ id, message, type, duration })

        setTimeout(() => {
            removeToast(id)
        }, duration)
    }

    const removeToast = (id: number) => {
        toasts.value = toasts.value.filter(t => t.id !== id)
    }

    return { toasts, showToast, removeToast }
}
