# AGENT.md: Sistema de Revisión por Pares (PWA + IA)

## 📋 Visión General
Este sistema es una plataforma de gestión editorial científica diseñada bajo el paradigma **Offline-First**. Su objetivo es permitir que revisores y editores trabajen en entornos de conectividad nula (vuelos, zonas remotas) mediante una **PWA** de alto rendimiento, asistida por **LLMs** para tareas de matching semántico y análisis de calidad.

---

## 🎨 Guía de Estilo y UI (Estética Vercel)
La interfaz debe ser **minimalista, funcional y de alto contraste**.

*   **Paleta de Colores:** Estrictamente B&N (Blanco y Negro).
    *   Fondo: `#000000` (Dark) / `#FFFFFF` (Light).
    *   Bordes: `1px solid #333` o `#eaeaea`.
    *   Acentos: Azul Vercel (`#0070f3`) solo para acciones primarias.
*   **Iconografía:** Uso exclusivo de **Lucide Vue Next**.
    *   No usar emojis. Stroke-width sugerido: `1.5`.
*   **Componentes:**
    *   Botones sin bordes redondeados excesivos (máximo `4px`).
    *   Espaciado consistente basado en múltiplos de 4 (Geist Design System).

---

## 🛠️ Buenas Prácticas y Reglas Técnicas

### 🟢 Frontend: Vue 3 + Vite
1.  **Composables (Logic-First):** Toda lógica de red en `useNetwork.ts`, sincronización en `useSync.ts` y persistencia en `useStorage.ts`.
2.  **Optimistic UI:** Actualizar el estado de Pinia/IndexedDB inmediatamente. La sincronización ocurre en segundo plano sin bloquear al usuario.
3.  **Tree-shaking de Iconos:** Importar solo lo necesario: `import { Check } from 'lucide-vue-next'`.
4.  **Dexie (IndexedDB):** Definir esquemas claros. Nunca guardar archivos pesados en `localStorage`.

### 🔵 Backend: NestJS + Node.js
1.  **Arquitectura Modular:** Cada dominio (Manuscripts, Users, AI) debe ser un `Module` independiente.
2.  **DTOs Estrictos:** Uso de `class-validator` y `class-transformer`. No se procesa data sin contrato.
3.  **Aislamiento de IA:** Las peticiones a LLMs deben ser asíncronas (Jobs). El cliente recibe un ID y consulta el estado vía WebSocket.
4.  **Manejo de Errores:** Filtros de excepción globales para devolver errores limpios en formato JSON.

### 🟡 Persistencia: MongoDB + Redis
1.  **MongoDB (Documentos):** Usar esquemas flexibles para el Feedback. Los comentarios deben ser sub-documentos, no tablas separadas.
2.  **Redis (Performance):** Implementar caché de "escritura a través" para los estados de los artículos y limitar la tasa de peticiones (Rate Limiting) de la API de IA.
3.  **Idempotencia:** Los endpoints de `/sync` deben verificar si un `command_id` ya fue procesado para evitar duplicados.

---

## 🛠️ Patrones de Diseño Críticos

| Patrón | Aplicación en el Proyecto |
| :--- | :--- |
| **Command** | Encapsula acciones offline (ej. `SubmitReview`) en una cola en IndexedDB para envío diferido. |
| **State** | Gestiona los estados de conexión de la PWA (ONLINE, OFFLINE, SYNCING). |
| **Facade** | El Service Worker centraliza el acceso a las APIs nativas (Cache, Background Sync, Push). |
| **CQRS** | Separa la escritura (MariaDB) de la lectura para dashboards analíticos (MongoDB). |
| **Adapter** | Abstrae el almacenamiento local para intercambiar entre IndexedDB y Cache API según el tipo de dato. |

---

## 💡 Buenas Prácticas de Desarrollo

### Frontend (Vue 3 + Lucide)
*   **Composables:** Toda lógica de red debe residir en `useNetwork.ts` y la de sincronización en `useSync.ts`.
*   **Iconos:** Importar iconos de forma individual de `lucide-vue-next` para favorecer el tree-shaking.
*   **Offline First:** Validar la integridad de los datos localmente antes de encolar comandos en la `SyncQueue`.

### Backend (NestJS)
*   **Idempotencia:** Los endpoints de sincronización `/sync` deben procesar identificadores únicos de comandos para evitar duplicados en reintentos.
*   **Aislamiento de IA:** El procesamiento de LLM debe ser asíncrono; el cliente recibe un ID de tarea y espera la resolución vía WebSocket.
*   **Validación:** Uso estricto de `DTOs` con la librería `class-validator`.

### Sincronización
*   **Conflictos:** Estrategia **Last Write Wins (LWW)** basada en el `client_timestamp` generado en el momento de la acción del usuario.
*   **Notificaciones:** Uso de `Toasts` dinámicos (Blanco/Negro) para informar sobre el progreso del `SyncEngine`.

---

## 🚀 Reglas del Agente
1.  **Priorizar Simplicidad:** Evitar infraestructuras complejas a menos que el escalamiento lo exija.
2.  **No Cajas Negras:** No implementar Firebase/Supabase para sincronización; trabajar sobre el motor manual de `SyncEngine`.
3.  **Consistencia UI:** Seguir estrictamente la estética de bordes definidos, tipografía limpia e iconos (SVG/Lucide). Está prohibido usar emojis.
4.  **Componentes Ad-hoc:** Priorizar siempre la creación y uso de componentes custom (`CustomSelect`, `CustomInput`, etc.) sobre los nativos de HTML para mantener la estética premium.

---
**Última actualización:** Marzo 2026.
**Estado del Proyecto:** Implementación de Segundo Incremento (Tablero de Estados y Sync).