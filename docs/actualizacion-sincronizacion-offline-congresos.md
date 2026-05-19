# Actualización: Sincronización Offline de Congresos y Membresías

## Problema Resuelto
Originalmente, la lógica offline (`useOfflineStorage.ts`) solo almacenaba en caché los **PDFs**, **borradores de revisiones** y **asignaciones** a través de IndexedDB. 
Si un usuario ingresaba a la aplicación o recargaba la página estando sin conexión a internet, la vista inicial (`CongressSelectionView.vue`) intentaba obtener la lista de congresos directamente del backend y fallaba, bloqueando al usuario en una pantalla de carga o vacía. Esto rompía el flujo *Offline-First* porque impedía al revisor acceder a sus asignaciones guardadas localmente.

## Cambios Implementados

### 1. Extensión de `useOfflineStorage.ts`
* **Nuevos Almacenes de Objetos (Stores):**
  * `congresos`: Guarda la lista completa de congresos disponibles para exploración y selección.
  * `memberships`: Guarda a cuáles congresos el usuario pertenece y sus roles correspondientes (ej. "Autor", "Revisor").
* **Incremento de Versión DB:** La variable `DB_VERSION` se subió a `4` para obligar al navegador a ejecutar el bloque `onupgradeneeded` y crear las nuevas tablas en IndexedDB.
* **Nuevos Métodos CRUD:** Se añadieron las funciones asíncronas para leer y sobreescribir los datos: `storeCongresses`, `getCongresses`, `storeMemberships`, y `getMemberships`.

### 2. Actualización de Vistas y Stores
* **`useCongressStore.ts`**:
  * La función `fetchMemberships` ahora funciona bajo un modelo "Offline-First". 
  * Si el entorno está Offline o si la petición a la API falla (ej. error 500, timeout), el store recupera las membresías cacheadas en `offlineStorage.getMemberships()`.
  * Si la petición a la API es exitosa, se guardan los datos frescos en IndexedDB.

* **`CongressSelectionView.vue`**:
  * La función `loadData` ahora valida si el dispositivo está sin red y recupera los congresos locales mediante `offlineStorage.getCongresses()`.
  * Si la petición a la API es exitosa, se actualiza IndexedDB con los nuevos congresos.

### 3. Corrección del Bug `DataCloneError`
Durante las pruebas, se descubrió que IndexedDB lanzaba un error `DataCloneError: Failed to execute 'put' on 'IDBObjectStore': #<Object> could not be cloned.` al intentar guardar la respuesta de la API. 

* **Causa:** En Vue 3, variables como `allCongresses.value` y `memberships.value` son *Proxies* reactivos. IndexedDB no puede clonar internamente estos proxies mediante el algoritmo Structured Clone.
* **Solución:** Se implementó una técnica de desempaquetado de Proxies utilizando `JSON.parse(JSON.stringify(datos))` justo antes de enviarlos a `storeCongresses` y `storeMemberships`. Esto elimina las envolturas reactivas y almacena objetos JS puros en IndexedDB.

## Flujo Offline Actualizado
Con estas actualizaciones, el flujo de trabajo de un revisor ahora soporta intermitencias de red completas:
1. **Online (Primer inicio de sesión):** El revisor ingresa con su email/password. Se cargan los congresos y membresías y se guardan silenciosamente en IndexedDB. Se descargan las asignaciones y PDFs.
2. **Offline (Pérdida de red):** El revisor puede recargar la página; el `CongressSelectionView.vue` lee de IndexedDB y renderiza los congresos. El revisor hace click en su congreso.
3. **Offline (Evaluación):** El `ReviewerView.vue` carga las asignaciones cacheadas y los PDFs. El revisor emite sus evaluaciones que se encolan en `sync_queue`.
4. **Online (Recuperación):** El motor de sincronización sube los datos a MariaDB/MongoDB.
