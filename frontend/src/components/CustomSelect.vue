<template>
  <div class="custom-select-wrapper" ref="wrapper" :class="{ 'is-open': isOpen }">
    <label v-if="label" class="select-label">{{ label }}</label>
    
    <div class="select-trigger" @click="toggleDropdown">
      <span v-if="selectedOption" class="selected-text">{{ selectedOption.label }}</span>
      <span v-else class="placeholder-text">{{ placeholder || 'Seleccionar...' }}</span>
      
      <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </div>

    <transition name="fade-slide">
      <div v-if="isOpen" class="select-dropdown">
        <div 
          v-for="option in options" 
          :key="option.value" 
          class="select-option"
          :class="{ 'is-selected': modelValue === option.value }"
          @click="selectOption(option)"
        >
          {{ option.label }}
          <svg v-if="modelValue === option.value" class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  modelValue: string | number
  options: Array<{ label: string; value: string | number }>
  label?: string
  placeholder?: string
}>()

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)
const wrapper = ref<HTMLElement | null>(null)

const selectedOption = computed(() => {
  return props.options.find(opt => opt.value === props.modelValue)
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectOption = (option: { label: string; value: string | number }) => {
  emit('update:modelValue', option.value)
  emit('change', option.value)
  isOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (wrapper.value && !wrapper.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<style scoped>
.custom-select-wrapper {
  position: relative;
  width: 100%;
  font-family: inherit;
}

.select-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0.9rem;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 40px;
}

.select-trigger:hover {
  border-color: var(--border-hover);
}

.custom-select-wrapper.is-open .select-trigger {
  border-color: var(--btn-primary-bg);
  box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.1);
}

.selected-text {
  font-size: 0.85rem;
  color: var(--text-strong);
  font-weight: 500;
}

.placeholder-text {
  font-size: 0.85rem;
  color: var(--text-faint);
}

.chevron-icon {
  width: 16px;
  height: 16px;
  color: var(--text-faint);
  transition: transform 0.2s ease;
}

.is-open .chevron-icon {
  transform: rotate(180deg);
}

.select-dropdown {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  right: 0;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
  padding: 0.25rem;
}

[data-theme="dark"] .select-dropdown {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.select-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0.75rem;
  font-size: 0.85rem;
  color: var(--text-normal);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.1s ease;
}

.select-option:hover {
  background: var(--bg-card-hover);
  color: var(--text-strong);
}

.select-option.is-selected {
  background: var(--bg-input);
  color: var(--btn-primary-bg);
  font-weight: 600;
}

.check-icon {
  width: 14px;
  height: 14px;
  color: var(--btn-primary-bg);
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
