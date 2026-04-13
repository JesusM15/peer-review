# CAMBIOS - Funcionalidad Offline para Revisores

## Resumen de Cambios

Se implementó la funcionalidad para que los revisores puedan revisar artículos **sin conexión a internet**. Los PDFs se descargan automáticamente al navegador y se almacenan localmente usando IndexedDB.

---

## Archivos Modificados

### Backend

#### `backend/src/articulos/articulos.controller.ts`
- **Agregado:** Endpoint `GET /api/articulos/:id/download` para descargar PDFs
- Permite descargar el archivo PDF directamente desde el servidor
- Manejo de errores con logging para debugging

#### `backend/src/articulos/articulos.service.ts`
- Modificación en `findOne()` para incluir `pdf_url` del documento MongoDB

#### `docker-compose.yml`
- **Agregado:** Volumen persistente `./backend/uploads:/app/uploads` para mantener los PDFs entre reinicios del contenedor

### Frontend

#### `frontend/src/composables/useOfflineStorage.ts` (NUEVO)
Composable para manejar IndexedDB:
- `storePdf()` - Guarda PDF en IndexedDB
- `getPdf()` - Recupera PDF de IndexedDB
- `deletePdf()` - Elimina PDF de IndexedDB
- `downloadAndStorePdf()` - Descarga del servidor y guarda localmente
- `storeAssignment()` / `getAllAssignments()` / `deleteAssignment()` - Manejo de metadatos
- `isOnline()` - Verifica estado de conexión de red
- `createPdfUrl()` / `revokePdfUrl()` - Manejo de URLs blob para mostrar PDFs

#### `frontend/src/views/ReviewerView.vue`
- **Agregado:** Botón "Guardar offline" en cada asignación
- **Agregado:** Badge "Disponible offline" cuando el PDF está guardado localmente
- **Agregado:** Indicador de conexión (Online/Offline) en el sidebar
- Sincronización automática de PDFs al cargar la página
- Soporte para cargar asignaciones desde IndexedDB cuando no hay internet

#### `frontend/src/views/RevisionForm.vue`
- **Agregado:** Badge "OFFLINE" con indicador visual (punto rojo parpadeante) en el header
- **Modificado:** Carga de PDF desde IndexedDB cuando está offline
- **Modificado:** Al completar revisión, elimina automáticamente el PDF local
- Guardado de revisiones pendientes en localStorage cuando está offline

---

## Pasos Necesarios para Aplicar Cambios

### 1. Reiniciar Docker (IMPORTANTE)

El volumen para uploads se agregó al docker-compose, por lo que es necesario reiniciar:

```bash
cd "c:\Users\bombo\OneDrive\Desktop\7mo\Ing Software\peer-review-master"
docker-compose down
docker-compose up -d
```

### 2. Re-subir PDFs existentes (si es necesario)

Si los artículos actuales no tienen sus PDFs accesibles, es posible que necesiten ser re-subidos debido a la configuración del volumen de Docker.

### 3. Verificar en Consola del Navegador

Para debugging, abrir DevTools (F12) → Console. Verás logs como:
```
[descargarParaOffline] Iniciando descarga...
[OfflineStorage] Descargando PDF desde: http://localhost:3000/api/articulos/xxx/download
[OfflineStorage] ✅ PDF guardado localmente
```

---

## Cómo Usar la Funcionalidad Offline

### Paso 1: Guardar para Offline (con internet)
1. Entrar a la página del revisor con conexión a internet
2. En cada asignación aparecerá el botón **"Guardar offline"**
3. Click para descargar el PDF a IndexedDB
4. Verás cambiar a **"Disponible offline"** ✅

### Paso 2: Revisar sin internet
**Opción A - Chrome DevTools:**
- F12 → Network → Cambiar "No throttling" a **"Offline"**
- Refrescar la página

**Opción B - Detener backend:**
```bash
docker stop peer_review_api
```

### Paso 3: Completar revisión
- Entrar al artículo (cargará desde IndexedDB)
- Hacer comentarios y seleccionar decisión
- Al enviar, el PDF se elimina automáticamente de la computadora local

---

## Prompts Solicitados (Resumen)

### Prompt 1 - Funcionalidad Offline (Request Principal)
> "vamos a trabajar con el revisor, quiero que el revisor pueda revisar articulos sin necesidad de internet, para esto quiero hacer lo siguiente:
> 
> Cuando se le asigne un articulo para revisar al revisor el articulo se tiene que guardar en la base de datos como lo estamos haciendo hasta ahorita pero ahora tambien se tiene que guardar en su computadora local para que cuando no tenga internet y quiera revisar un articulo lo pueda abrir desde la pagina y hacer su revision...
> 
> La segunda cosa que quiero es que cuando el revisor este revisando el articulo, de forma offline, y ya una vez que haya hechos la revision... el articulo se tiene que borrar del local..."

**Implementación:**
- Crear composable `useOfflineStorage` con IndexedDB
- Modificar `ReviewerView` para descargar PDFs automáticamente
- Modificar `RevisionForm` para cargar desde IndexedDB cuando offline
- Eliminar PDF local al completar revisión

### Prompt 2 - Indicador de Conexión
> "agrega una forma de saber si tengo internet o no, que se vea tanto en la pagina del revisor como en la pagina donde se hace la revision"

**Implementación:**
- Badge "En línea" / "Sin conexión" en sidebar de ReviewerView
- Badge "OFFLINE" con punto parpadeante en header de RevisionForm
- Escucha de eventos `online`/`offline` del navegador

---

## Notas Técnicas

### IndexedDB Schema
- **Database:** `peer_review_offline`
- **Versión:** 1
- **Stores:**
  - `pdfs`: `{ articuloId, blob, titulo, downloadedAt }`
  - `assignments`: `{ asignacionId, articuloId, titulo, autorNombre, fechaLimite, estado, synced }`

### URLs Importantes
- API Backend: `http://localhost:3000/api`
- Endpoint descarga: `GET /api/articulos/:id/download`

### Limitaciones Conocidas
- `navigator.onLine` no detecta si el backend está caído (solo detecta red)
- Los PDFs deben guardarse manualmente o automáticamente ANTES de perder conexión
- Las revisiones hechas offline se guardan en `localStorage` (no se envían automáticamente al recuperar conexión)

---

## Usuarios de Prueba

| Email | Rol | Contraseña |
|-------|-----|------------|
| revisor@diego.edu | Revisor | password123 |
| editor@diego.edu | Editor | password123 |
| autor@diego.edu | Autor | password123 |

---

*Última actualización: Abril 2026*
