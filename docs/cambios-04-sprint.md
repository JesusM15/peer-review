# Cambios Sprint 4 - Gestión de Roles

Este documento detalla los cambios realizados en el backend y frontend para implementar el flujo de solicitud de cambio de rol.

## Backend

### 1. Nueva Entidad: `SolicitudRol`
- Ubicación: `src/solicitudes/entities/solicitud-rol.entity.ts`
- Tabla: `solicitudes_rol`
- Propósito: Almacenar las peticiones de los usuarios para cambiar de rol dentro de un congreso.

### 2. Módulo de Solicitudes
- Ubicación: `src/solicitudes/`
- Endpoints:
  - `POST /api/solicitudes`: Crear una nueva solicitud (con validación de cooldown de 1 hora).
  - `GET /api/solicitudes/congreso/:id`: Listar solicitudes de un congreso (para Editores).
  - `GET /api/solicitudes/usuario/:id`: Listar solicitudes de un usuario (para seguimiento).
  - `PATCH /api/solicitudes/:id/responder`: Aprobar o rechazar una solicitud.

### 3. Migración de Base de Datos
Se creó un script de migración manual para inicializar la tabla necesaria:
- Script: `src/database/migration-solicitudes.ts`
- Comando ejecutado: `docker exec peer_review_api npx ts-node src/database/migration-solicitudes.ts`

## Frontend

### 1. Vista de Postulación
- Ubicación: `src/views/PostulacionView.vue`
- Funcionalidad: Los autores y revisores pueden enviar una postulación y ver el estado de sus solicitudes anteriores.

### 2. Panel de Aprobaciones (Editor)
- Ubicación: `src/views/EditorView.vue` (Pestaña "Solicitudes")
- Funcionalidad: Los editores pueden ver las solicitudes pendientes y aprobarlas (icono ✓) o rechazarlas (icono ✕) con un feedback opcional.

### 3. Navegación
- Se añadieron enlaces en el Sidebar de `AuthorView` y `ReviewerView`.
- Se registró la ruta `/postulacion` en el router.

---
*Fecha: 12 de mayo de 2026*
