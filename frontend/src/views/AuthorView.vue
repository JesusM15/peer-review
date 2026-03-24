<template>

  <div class="author-view">

    <header class="header">

      <button @click="goBack" class="back-button">

        ← Volver

      </button>

      <h1>✍️ Autor</h1>

      <div class="spacer"></div>

    </header>

    

    <main class="main-content">

      <div class="container">

        <div class="form-container">
          <h2>Registrar Nuevo Artículo</h2>
          
          <form @submit.prevent="submitArticulo" class="articulo-form">
            <div class="form-group">
              <label for="titulo">Título del Artículo:</label>
              <input 
                type="text" 
                id="titulo" 
                v-model="tituloArticulo" 
                placeholder="Ingrese el título del artículo"
                required
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="nombreAutor">Nombre del Autor:</label>
              <input 
                type="text" 
                id="nombreAutor" 
                v-model="nombreAutor" 
                placeholder="Ingrese su nombre completo"
                required
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="autorId">ID del Autor (UUID):</label>
              <input 
                type="text" 
                id="autorId" 
                v-model="autorId" 
                placeholder="ID del autor (se generará automáticamente si está vacío)"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="pdfFile">Documento PDF:</label>
              <div class="file-upload-container">
                <input 
                  type="file" 
                  id="pdfFile" 
                  @change="handleFileUpload"
                  accept=".pdf"
                  required
                  class="file-input"
                />
                <div class="file-upload-label">
                  <span v-if="!archivoPdf" class="file-placeholder">
                    Click para seleccionar PDF o arrastrar aquí
                  </span>
                  <span v-else class="file-selected">
                    📄 {{ archivoPdf.name }} ({{ formatFileSize(archivoPdf.size) }})
                  </span>
                </div>
              </div>
            </div>
            
            <div class="form-actions">
              <button type="submit" class="submit-button" :disabled="isLoading">
                {{ isLoading ? 'Registrando...' : 'Registrar Artículo' }}
              </button>
            </div>
          </form>
        </div>

      </div>

    </main>

  </div>

</template>



<script setup lang="ts">

import { useRouter } from 'vue-router'
import { ref } from 'vue'



const router = useRouter()

const message = ref<string>('Esperando comunicación con el Backend...')
const status = ref<string>('idle') // idle | waiting | success | error
const mostrarFormulario = ref<boolean>(true)
const tituloArticulo = ref<string>('')
const nombreAutor = ref<string>('')
const autorId = ref<string>('')
const archivoPdf = ref<File | null>(null)
const isLoading = ref<boolean>(false)

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const goBack = () => {

  router.push('/')

}

const submitArticulo = async () => {
  try {
    isLoading.value = true
    
    // Generar UUIDs si no están presentes
    const articuloId = generateUUID()
    const autorIdFinal = autorId.value || generateUUID()
    
    // Preparar el DTO según lo espera el backend
    const createArticuloDto = {
      id: articuloId,
      titulo: tituloArticulo.value,
      autor_id: autorIdFinal,
      pdf_url: '', // Se actualizará después de subir el archivo
      keywords: [] // Opcional, por ahora vacío
    }
    
    console.log('Enviando artículo:', createArticuloDto)
    
    // Enviar al backend
    const response = await fetch(`${API_BASE_URL}/articulos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createArticuloDto)
    })
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`)
    }
    
    const result = await response.json()
    console.log('Artículo registrado:', result)
    
    alert(`Artículo "${tituloArticulo.value}" registrado con éxito (ID: ${articuloId})`)
    
    // Limpiar formulario
    tituloArticulo.value = ''
    nombreAutor.value = ''
    autorId.value = ''
    archivoPdf.value = null
    
  } catch (error) {
    console.error('Error al registrar artículo:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    alert(`Error al registrar artículo: ${errorMessage}`)
  } finally {
    isLoading.value = false
  }
}

const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    // Validar que sea un PDF
    if (file.type === 'application/pdf') {
      archivoPdf.value = file
    } else {
      alert('Por favor, seleccione un archivo PDF válido')
      target.value = ''
    }
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const cancelarFormulario = () => {
  tituloArticulo.value = ''
  nombreAutor.value = ''
  autorId.value = ''
  archivoPdf.value = null
}

</script>



<style scoped>

.author-view {

  min-height: 100vh;

  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);

}



.header {

  display: flex;

  align-items: center;

  padding: 1.5rem 2rem;

  background: rgba(17, 17, 17, 0.9);

  border-bottom: 1px solid #333;

  backdrop-filter: blur(10px);

}



.back-button {

  background: #1a1a1a;

  border: 1px solid #444;

  color: #ffffff;

  padding: 0.5rem 1rem;

  border-radius: 8px;

  cursor: pointer;

  font-size: 0.9rem;

  transition: all 0.3s ease;

}



.back-button:hover {

  background: #2a2a2a;

  border-color: #666;

}



h1 {

  margin: 0;

  font-size: 1.5em;

  font-weight: 600;

  color: #ffffff;

  flex: 1;

  text-align: center;

}



.spacer {

  width: 80px;

}



.main-content {

  padding: 2rem;

}



.container {

  width: 100%;

  margin: 0 auto;

  text-align: center;

  color: #888;

  font-size: 1.1rem;

}

.submit-button {
  background: #ffffff;
  color: #000000;
  border: 1px solid #444;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.submit-button:hover {
  background: #f0f0f0;
  border-color: #666;
}

.form-container {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 3rem;
  margin-top: 2rem;
  border: 1px solid #333;
  max-width: 95%;
  width: 95%;
  margin-left: auto;
  margin-right: auto;
}

.form-container h2 {
  margin-top: 0;
  font-size: 2.5em;
  font-weight: 800;
  background: -webkit-linear-gradient(120deg, #ffffff, #888888);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 2rem;
  text-align: center;
}

.articulo-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.form-group label {
  color: #ffffff;
  font-weight: 400;
  font-size: 0.95em;
  margin-bottom: 0.5rem;
  font-family: 'Arial', sans-serif;
}

.form-input {
  width: 100%;
  padding: 0.5rem 2.5rem;
  border: 1px solid #555;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 1em;
  font-weight: 300;
  font-family: 'Arial', sans-serif;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #4CAF50;
  background: rgba(255, 255, 255, 0.15);
}

.form-input::placeholder {
  color: #a0a0a0;
  font-weight: 400;
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.file-upload-container {
  position: relative;
  width: 100%;
}

.file-input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.file-upload-label {
  display: block;
  width: 100%;
  padding: 1rem 2rem;
  border: 2px dashed #555;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.file-upload-label:hover {
  border-color: #777;
  background: rgba(255, 255, 255, 0.08);
}

.file-placeholder {
  color: #a0a0a0;
  font-style: normal;
  font-size: 0.95em;
  font-weight: 300;
  font-family: 'Arial', sans-serif;
}

.file-selected {
  color: #4CAF50;
  font-weight: 400;
  font-size: 0.95em;
  font-family: 'Arial', sans-serif;
}

</style>

