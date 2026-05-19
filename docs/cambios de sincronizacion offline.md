# Motor de Sincronización Offline

Este proyecto implementa un sistema de sincronización robusto diseñado para permitir que los usuarios realicen acciones críticas sin conexión a internet, las cuales se sincronizan automáticamente al recuperar la conectividad.

## 🚀 Arquitectura del Motor

El motor de sincronización (`useSyncEngine.ts`) funciona como un middleware entre la interfaz de usuario y la API, garantizando que ninguna acción del usuario se pierda por fallos de red.

### Componentes Principales

1.  **Cola de Persistencia (IndexedDB)**:
    Utiliza un almacenamiento local seguro para encolar tareas con estado (pendiente, sincronizando, fallido) y contadores de reintentos.
    
2.  **Manejadores de Acciones (Handlers)**:
    Sistema extensible que permite registrar lógica específica para cada tipo de acción (Revisiones, Cambios de Estado, etc.).

### 📋 Registro de Requerimientos y Ajustes (Sesión de Optimización)

Durante esta fase de desarrollo, se han atendido los siguientes objetivos estratégicos para mejorar la robustez y experiencia del usuario:

*   **Estabilidad de Sincronización**: Resolución de excepciones en la comunicación con la API (errores 404/500) y optimización del flujo de datos entre el motor offline y el backend.
*   **Gestión Proactiva de Estados**: Implementación de un sistema de activación automática. El artículo cambia a estado "En Revisión" en el servidor en el momento exacto en que el revisor comienza la edición del formulario, asegurando la trazabilidad en tiempo real.
*   **Persistencia Temporal (Drafts)**: Desarrollo de un sistema de guardado automático local en IndexedDB que protege el progreso del usuario sección por sección (Introducción, Metodología, etc.) sin necesidad de confirmación manual.
*   **Optimización de Interfaz y UX**:
    *   **Layout Adaptativo**: Implementación de paneles independientes con scroll propio (PDF vs. Formulario) para una navegación más eficiente.
    *   **Consistencia de Diseño**: Restauración de la identidad visual de la plataforma, ajustando iconos, tipografías y paletas de colores para cumplir con los estándares estéticos establecidos.
    *   **Soporte Multitema**: Integración total de la paleta Dark/Light en todos los componentes administrativos y de revisión, asegurando legibilidad y contraste óptimo (letras más claras en fondos oscuros).
*   **Seguridad y Procesos**:
    *   **Revisión a Ciegas**: Anonimización total de la interfaz del revisor, eliminando nombres de autores para garantizar la imparcialidad del proceso.
    *   **Modo de Solo Lectura**: Implementación de un visor de histórico de revisiones que permite consultar evaluaciones previas sin riesgo de modificar estados finalizados.
    *   **Flujo de Registro Simplificado**: Restricción de selección de roles en el registro público. Los nuevos usuarios se registran exclusivamente como 'Autor', dejando la elevación de privilegios a cargo de la administración.

### ✅ Resultados Obtenidos
*   Sincronización transparente entre MariaDB (estados) y MongoDB (comentarios detallados).
*   Interfaz de revisión coherente, responsive y fiel al diseño original.
*   Sistema de gestión administrativa compatible con modo oscuro y de alta legibilidad.

---

> [!NOTE]
> Las revisiones offline ahora se gestionan mediante IndexedDB, eliminando dependencias de almacenamiento volátil y permitiendo un manejo de errores sofisticado con reintentos automáticos.
