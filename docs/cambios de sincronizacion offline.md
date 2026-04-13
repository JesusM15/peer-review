# Motor de Sincronización Offline

Este proyecto implementa un sistema de sincronización robusto diseñado para permitir que los usuarios (revisores, autores, editores) realicen acciones críticas sin conexión a internet, las cuales se sincronizarán automáticamente de forma transparente cuando se recupere la conectividad.

## 🚀 Arquitectura del Motor

El motor de sincronización (`useSyncEngine.ts`) funciona como un "middleware" entre la UI y las llamadas a la API.

### Componentes Principales

1.  **Cola de Sincronización (IndexedDB)**:
    Utiliza un store llamado `sync_queue` dentro de la base de datos `peer_review_offline`. Esto asegura que las acciones no se pierdan incluso si el usuario cierra la pestaña o reinicia el navegador.
    Cada elemento en la cola tiene la siguiente estructura:
    ```typescript
    {
      id: string;        // UUID único
      type: string;      // Ej: 'REVISION'
      payload: any;      // Datos de la acción a enviar
      status: string;    // 'pending' | 'syncing' | 'failed'
      attempts: number;  // Contador de reintentos
      timestamp: number; // Orden cronológico
    }
    ```

2.  **Handlers (Controladores)**:
    El motor es agnóstico al tipo de datos. Los handlers se registran globalmente (normalmente en `App.vue`) para definir cómo debe procesarse cada tipo de acción.
    ```typescript
    syncEngine.registerHandler('REVISION', async (data) => {
      return await fetch('/api/revisiones', { ... });
    });
    ```

3.  **Estrategia de Sincronización**:
    *   **Inmediata**: Si hay internet al registrar la acción, se intenta sincronizar al instante.
    *   **Basada en Eventos**: Escucha el evento `window.online` para disparar el procesamiento de la cola.
    *   **Proactiva**: Al iniciar la aplicación (`onMounted` en `App.vue`), revisa si hay tareas pendientes.

## 🛠️ Compatibilidad con MariaDB y MongoDB (Dual DB)

El motor está preparado para flujos de trabajo de "Doble Escritura". Para la funcionalidad de revisiones, el flujo es el siguiente:

1.  **Frontend**: Envía el objeto de revisión completo.
2.  **Backend (`submitRevision`)**:
    *   **MongoDB**: Guarda el documento JSON flexible en la colección `Revision` (comentarios, estructura dinámica).
    *   **MariaDB**: Actualiza la entidad `Articulo` cambiando su estado (ej. de "En Revisión" a "Publicado" o "En Edición") y limpia la asignación del revisor.

## 📝 Bitácora de Prompts y Ajustes (Sesión de Sincronización y UI)

A continuación se detallan las correcciones, aceptaciones y mejoras solicitadas por el usuario durante la implementación del motor offline y la interfaz de revisión:

### 1. Correcciones de Errores Críticos (Bugs)
*   **Error de IndexedDB (`NotFoundError`)**: Se corrigió el error al intentar transaccionar sobre stores no existentes mediante una migración de base de datos a la versión 3.
*   **Error de Clonación (`DataCloneError`)**: Se solucionó el fallo al intentar guardar objetos complejos con Proxies de Vue en IndexedDB, asegurando el uso de `JSON.parse(JSON.stringify())` antes de persistir.
*   **Errores 404/500 en API**: Se ajustaron los endpoints y se robusteció el servicio de asignaciones para manejar correctamente la doble escritura entre MariaDB y MongoDB.

### 2. Estética y UI (Correcciones de diseño)
*   **Scroll "Roto"**: Se corrigió el scroll global que rompía la web. **Solución aceptada**: Paneles independientes (PDF a la izquierda con su propio scroll y Formulario a la derecha con el suyo).
*   **Flecha de Retroceso**: Se corrigió el tamaño excesivo de la flecha de "Volver atrás" y se ajustó a la estética general.
*   **Sidebar y Logo**: Se eliminó el logo genérico inyectado por error y se restauró el sidebar original con el nombre "Diego" y la iconografía oficial de 1.5px.
*   **Modo Claro/Oscuro**: Se sincronizaron las tarjetas de veredicto y el sidebar para que respondan correctamente al `useTheme` global, eliminando estilos "hardcoded" que se veían mal en modo claro.

### 3. Funcionalidad y UX (Mejoras solicitadas)
*   **Autosave**: Implementación de guardado automático de borradores en IndexedDB mientras el usuario escribe.
*   **Activación de Estado**: El artículo cambia automáticamente a "En Revisión" en el servidor en cuanto el revisor comienza a completar cualquier campo.
*   **Modo Solo Lectura**: Se implementó una vista de consulta para artículos ya revisados, recuperando los comentarios desde MongoDB y bloqueando la edición.
*   **Historial en Dashboard**: Se separaron las asignaciones "En curso" de las "Completadas", eliminando el botón de revisar en estas últimas y moviéndolas a una sección de historial.

### 4. Elementos Aceptados y Destacados
*   **Selector de Veredicto**: El sistema de tarjetas con iconos (Aceptado, Revisión, Rechazado) fue del agrado del usuario tras ajustar sus colores para que coincidan con la plataforma.
*   **Layout Responsive**: El apilamiento vertical en móviles para mantener el PDF accesible sobre el formulario fue validado positivamente.

---

> [!NOTE]
> Las revisiones offline ahora se guardan en IndexedDB, eliminando la dependencia de `localStorage` y permitiendo un manejo de errores más detallado con reintentos automáticos.
