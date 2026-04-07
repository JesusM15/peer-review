<template>
  <div class="toast-container">
    <TransitionGroup name="toast" tag="div" class="toast-list">
      <div v-for="toast in toasts" :key="toast.id" class="toast" :class="toast.type">
        <div class="toast-content">
          <!-- Icon success -->
          <svg v-if="toast.type === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M22 4L12 14.01l-3-3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <!-- Icon error -->
          <svg v-else-if="toast.type === 'error'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="15" y1="9" x2="9" y2="15" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="9" y1="9" x2="15" y2="15" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <!-- Icon info -->
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 16v-4M12 8h.01" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>

          <span>{{ toast.message }}</span>
        </div>
        <!-- Progress bar -->
        <div class="progress-bar-container">
           <div class="progress-bar" :style="{ animationDuration: `${toast.duration + 200}ms` }"></div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '../composables/useToast'
const { toasts } = useToast()
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  pointer-events: none;
}

.toast-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.toast {
  position: relative;
  background: var(--bg-sidebar);
  color: var(--text-strong);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  width: 340px;
  max-width: calc(100vw - 4rem);
  display: flex;
  flex-direction: column;
  pointer-events: auto;
}

[data-theme="dark"] .toast {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 1.25rem;
  font-size: 0.85rem;
  font-weight: 500;
  line-height: 1.4;
  color: var(--text-strong);
}

.toast-content svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.toast.success .toast-content svg { color: var(--stat-aceptado); }
.toast.error .toast-content svg { color: var(--stat-rechazado); }
.toast.info .toast-content svg { color: var(--stat-progreso); }

.progress-bar-container {
  height: 3px;
  width: 100%;
  background: var(--bg-card-hover);
}

.progress-bar {
  height: 100%;
  width: 100%;
  animation-name: progress;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

.toast.success .progress-bar { background: var(--stat-aceptado); }
.toast.error .progress-bar { background: var(--stat-rechazado); }
.toast.info .progress-bar { background: var(--stat-progreso); }

@keyframes progress {
  from { width: 100%; }
  to { width: 0%; }
}

/* Animations */
.toast-enter-active,
.toast-leave-active,
.toast-move {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.95);
}

.toast-leave-to {
  opacity: 0;
  transform: scale(0.95);
  margin-bottom: -60px; /* para colapsar espacio */
}

@media (max-width: 600px) {
  .toast-container {
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
    align-items: center;
  }
  .toast {
    width: 100%;
  }
}
</style>
