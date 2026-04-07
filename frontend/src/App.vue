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
import ToastContainer from './components/ToastContainer.vue'

const { initTheme } = useTheme()

onMounted(() => {
  initTheme()
})
</script>