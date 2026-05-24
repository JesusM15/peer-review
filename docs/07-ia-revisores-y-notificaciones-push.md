# Agente de IA para revisores y notificaciones push

Documentación de los cambios recientes en el sistema Peer Review: **sugerencia de revisores con IA** y **notificaciones in-app + push** cuando un artículo cambia de estado.

Está pensada para quien clone el repo o haga `git pull` y necesite que todo funcione igual que en el entorno donde se desarrolló.

---

## Resumen

| Funcionalidad | Qué hace | Dónde se usa |
|---------------|----------|--------------|
| **Sugerencia de revisores (IA)** | Analiza el artículo (título, tags, texto del PDF si existe) y rankea revisores del congreso por especialidad | Vista **Editor** → Asignaciones → **Sugerir con IA** |
| **Notificaciones in-app** | Guarda avisos en BD y muestra campana con historial | Autor, Revisor, Editor, Admin |
| **Notificaciones push** | Envía alertas al navegador/OS aunque la pestaña no esté activa | Mismo panel → botón **Activar push** |

---

## 1. Agente de IA — Sugerencia de revisores

### Descripción

El editor selecciona un artículo y pulsa **Sugerir con IA**. El backend:

1. Carga el artículo y los revisores del congreso (o todos los revisores globales si no hay membresía).
2. Extrae texto del PDF desde MongoDB (`articulo_detalle.pdf_url`) cuando está disponible.
3. Obtiene etiquetas del artículo (`articulo_tags` + `keywords` en MongoDB).
4. Llama al proveedor de IA configurado (Gemini, Groq u Ollama) para puntuar revisores (0–100).
5. Si la IA falla o no hay API key, usa un **ranking por coincidencia de especialidades** (fallback).

Cada sugerencia incluye: nombre, email, especialidades, `match_score`, motivo, artículos ya asignados y si puede recibir más (límite &lt; 3).

### API

| Método | Ruta | Auth |
|--------|------|------|
| `POST` | `/api/ai/suggest-reviewers/:articuloId` | JWT (Editor u otro rol con acceso) |

**Respuesta (ejemplo):**

```json
[
  {
    "reviewer_id": "uuid",
    "nombre": "María García",
    "email": "maria.garcia@uni.edu",
    "especialidades": ["Machine Learning", "Data Science"],
    "match_score": 85,
    "match_reason": "Coincide con el tema del artículo...",
    "articulos_asignados": 0,
    "puede_recibir_mas": true
  }
]
```

### Configuración de IA

La IA usa la misma configuración que plagio/ética:

- **Admin** → sección de configuración de IA, o
- `GET/PATCH` `/api/ai/config`

Sin API key válida, el endpoint **sigue respondiendo** con el ranking por especialidades (no debería devolver error 500).

### Archivos principales (backend)

- `backend/src/ai/services/reviewer-suggestion.service.ts` — lógica de sugerencias
- `backend/src/ai/dto/reviewer-suggestion.dto.ts` — tipos de respuesta
- `backend/src/ai/ai.controller.ts` — endpoint `suggest-reviewers`
- `backend/src/ai/ai.module.ts` — importa `AsignacionesModule` para repositorios

### Archivos principales (frontend)

- `frontend/src/stores/ai.ts` — `suggestReviewers(articuloId)`
- `frontend/src/views/EditorView.vue` — UI “Sugerir con IA” y lista de sugerencias

### Revisores de prueba

Script para crear/actualizar revisores con perfiles y membresía en el congreso **Fundacional 2026** (o el primero disponible):

```bash
docker exec peer_review_api npx ts-node src/database/migration-add-reviewers.ts
```

Usuarios creados/actualizados (contraseña: `password123`):

| Email | Especialidades (ejemplo) |
|-------|---------------------------|
| maria.garcia@uni.edu | Machine Learning, Data Science, Python |
| carlos.lopez@uni.edu | Blockchain, Criptografía, Seguridad |
| ana.martinez@uni.edu | IoT, Embedded Systems, C++ |
| pedro.ramirez@uni.edu | Redes, Cloud Computing, DevOps |
| lucia.fernandez@uni.edu | UX, HCI, Accesibilidad |
| jorge.herrera@uni.edu | Bases de Datos, SQL, Big Data |

También existe el revisor por defecto: `revisor@diego.edu` / `password123`.

---

## 2. Notificaciones in-app y push

### Descripción

Cuando un artículo **cambia de estado**, el sistema notifica:

- Al **autor** del artículo.
- A cada **revisor asignado** a ese artículo.

Esto ocurre en:

- `PATCH /api/articulos/:id` con campo `estado`.
- Asignación de revisor (p. ej. Borrador → En Revisión).
- Entrega de revisión (`POST /api/revisiones` — aceptado / revisión / rechazado).

Cada notificación se guarda en la tabla `notificaciones` y, si el usuario activó push, se envía también vía **Web Push (VAPID)**.

### Tipos de notificación

| Tipo | Cuándo |
|------|--------|
| `ArticuloEstado` | Cambio de estado del artículo |
| `SolicitudCongresoNueva` / `Aprobada` / `Rechazada` | Flujo de solicitudes de congreso (ya existía) |
| `General` | Otros avisos |

### API de notificaciones

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/notificaciones` | Lista del usuario (`?no_leidas=true` opcional) |
| `GET` | `/api/notificaciones/contar-no-leidas` | Contador |
| `PATCH` | `/api/notificaciones/:id/leer` | Marcar una como leída |
| `PATCH` | `/api/notificaciones/leer-todas` | Marcar todas |
| `GET` | `/api/notificaciones/push/vapid-public-key` | Clave pública VAPID |
| `POST` | `/api/notificaciones/push/subscribe` | Registrar dispositivo |
| `DELETE` | `/api/notificaciones/push/unsubscribe` | Quitar suscripción |

### UI

Componente reutilizable: `frontend/src/components/NotificationBell.vue`

Integrado en la barra lateral de:

- `AuthorView.vue`
- `ReviewerView.vue`
- `EditorView.vue`
- `AdminView.vue`

Composables:

- `frontend/src/composables/useNotifications.ts` — carga y lectura
- `frontend/src/composables/usePushNotifications.ts` — permisos y suscripción push

Service worker: `frontend/public/push-handler.js` (importado por Workbox en `vite.config.ts`).

### Archivos principales (backend)

- `backend/src/notificaciones/notificaciones.service.ts` — creación + `notificarCambioEstadoArticulo`
- `backend/src/notificaciones/push.service.ts` — Web Push con `web-push`
- `backend/src/notificaciones/entities/push-subscription.entity.ts`
- `backend/src/articulos/articulos.service.ts` — hook al actualizar `estado`
- `backend/src/asignaciones/asignaciones.service.ts` — hook en asignación y revisión

### Dependencia nueva (backend)

```json
"web-push": "^3.x"
```

Tras `git pull`, si cambió `backend/package.json`:

```bash
docker exec -it peer_review_api npm install
```

---

## 3. Pasos obligatorios para compañeros (setup)

### 3.1 Clonar / actualizar código

```bash
git pull origin main   # o la rama que usen
```

### 3.2 Instalar dependencias

**Backend (dentro de Docker):**

```bash
docker compose up -d
docker exec -it peer_review_api npm install
```

**Frontend (en tu máquina):**

```bash
cd frontend
npm install
```

### 3.3 Variables de entorno — Backend

Copiar ejemplo y completar:

```bash
cp backend/.env.example backend/.env
```

Agregar en `backend/.env` (obligatorio para **push**):

```env
# Web Push — generar con: npx web-push generate-vapid-keys
VAPID_PUBLIC_KEY=tu_clave_publica
VAPID_PRIVATE_KEY=tu_clave_privada
VAPID_SUBJECT=mailto:soporte@peerreview.local
```

Generar claves (en `backend/`):

```bash
npx web-push generate-vapid-keys
```

> **Importante:** Si cambias `.env`, recrea el contenedor API para que cargue las variables:
>
> ```bash
> docker compose up -d api --force-recreate
> ```
>
> Un simple `docker restart` **no** siempre recarga `env_file`.

Opcional para **IA con Gemini/Groq**: configurar API key desde Admin o en BD (`ai_configs`).

### 3.4 Migraciones de base de datos

Ejecutar **en este orden** si la BD es nueva o venían de una versión sin estas tablas:

```bash
# Tablas: articulo_tags, revisor_tags, congreso_tags
docker exec peer_review_api npx ts-node src/database/migration-create-missing-tables.ts

# Tabla: push_subscriptions
docker exec peer_review_api npx ts-node src/database/migration-push-subscriptions.ts

# Revisores de prueba + membresía en congreso
docker exec peer_review_api npx ts-node src/database/migration-add-reviewers.ts
```

Migraciones opcionales (solo si las necesitan en su flujo):

```bash
# Membresía de congreso vía API (backend debe estar arriba)
docker exec peer_review_api npx ts-node src/database/migration-add-reviewer-congress-membership.ts

# Tags de revisores vía API
docker exec peer_review_api npx ts-node src/database/migration-add-reviewer-tags.ts
```

### 3.5 Frontend en desarrollo

```bash
cd frontend
npm run dev
```

La PWA tiene el service worker habilitado en dev (`vite.config.ts` → `devOptions.enabled: true`) para probar push en `http://localhost:5173`.

El proxy de Vite redirige `/api` → `http://localhost:3000`.

### 3.6 Verificar que el backend arrancó bien

En logs del API debe aparecer:

```
[PushService] Web Push habilitado con VAPID.
```

Si aparece:

```
VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY no configuradas. Push deshabilitado.
```

→ Las notificaciones **in-app** funcionan; **push** no, hasta configurar `.env` y recrear el contenedor.

---

## 4. Cómo probar

### IA — Sugerir revisores

1. Login: `editor@diego.edu` / `password123`
2. Elegir congreso → ir a **Editor** → **Asignaciones**
3. Seleccionar un artículo → **Sugerir con IA**
4. Debe listarse al menos un revisor con puntaje y motivo

### Notificaciones in-app

1. Login editor → cambiar estado de un artículo (p. ej. a **Aceptado**) vía API o flujo de revisión
2. Login autor: `autor@diego.edu` / `password123`
3. Abrir campana en `/author` → debe aparecer *"Estado de tu artículo actualizado"*

### Push

1. Login como autor o revisor
2. Campana → **Activar push** → aceptar permiso del navegador
3. Con otra sesión (editor), cambiar estado del artículo del autor
4. Debe mostrarse notificación del sistema (con pestaña en segundo plano o PWA instalada)

> Push en Chrome/Edge suele requerir HTTPS en producción; en localhost funciona para desarrollo.

---

## 5. Usuarios de prueba (referencia)

| Rol | Email | Contraseña |
|-----|-------|------------|
| Editor | editor@diego.edu | password123 |
| Autor | autor@diego.edu | password123 |
| Revisor | revisor@diego.edu | password123 |
| Admin | admin@diego.edu | admin123 |

(Revisores extra: ver tabla en sección 1.)

---

## 6. Problemas frecuentes

### Error 500 al usar “Sugerir con IA”

**Causa habitual:** falta la tabla `articulo_tags`.

**Solución:**

```bash
docker exec peer_review_api npx ts-node src/database/migration-create-missing-tables.ts
```

### No aparecen revisores en las sugerencias

- Verificar que hay usuarios con rol `Revisor` y membresía en el congreso del artículo.
- Ejecutar `migration-add-reviewers.ts`.
- Sin membresía, el servicio hace fallback a todos los revisores globales.

### Push: “no están configuradas en el servidor”

- Completar `VAPID_*` en `backend/.env`
- `docker compose up -d api --force-recreate`

### Push: permiso denegado en el navegador

- Restablecer permisos del sitio en configuración del navegador
- Usar HTTPS o `localhost`
- Volver a pulsar **Activar push**

### `Cannot find module 'web-push'`

```bash
docker exec -it peer_review_api npm install
```

### Cambios en `.env` no aplican

```bash
docker compose up -d api --force-recreate
```

---

## 7. Lista de archivos nuevos o relevantes

### Backend

```
backend/src/ai/services/reviewer-suggestion.service.ts
backend/src/ai/dto/reviewer-suggestion.dto.ts
backend/src/notificaciones/push.service.ts
backend/src/notificaciones/entities/push-subscription.entity.ts
backend/src/notificaciones/dto/push-subscribe.dto.ts
backend/src/database/migration-create-missing-tables.ts
backend/src/database/migration-push-subscriptions.ts
backend/src/database/migration-add-reviewers.ts
```

### Frontend

```
frontend/src/components/NotificationBell.vue
frontend/src/composables/useNotifications.ts
frontend/src/composables/usePushNotifications.ts
frontend/public/push-handler.js
```

### Modificados (entre otros)

```
backend/src/ai/ai.controller.ts
backend/src/ai/ai.module.ts
backend/src/notificaciones/notificaciones.service.ts
backend/src/notificaciones/notificaciones.controller.ts
backend/src/articulos/articulos.service.ts
backend/src/asignaciones/asignaciones.service.ts
frontend/src/stores/ai.ts
frontend/src/views/EditorView.vue
frontend/src/views/AuthorView.vue
frontend/src/views/ReviewerView.vue
frontend/src/views/AdminView.vue
frontend/vite.config.ts
backend/.env.example
```

---

## 8. Documentación relacionada

- [04-instrucciones-instalacion.md](./04-instrucciones-instalacion.md) — `npm install` con Docker
- [03-dockertutorial.md](./03-dockertutorial.md) — Docker Compose
- [01-instrucciones-bd.md](./01-instrucciones-bd.md) — Base de datos
- [06-sistema-gestion-staff.md](./06-sistema-gestion-staff.md) — Tags y staff

---

## Checklist rápido para el equipo

- [ ] `git pull`
- [ ] `docker compose up -d`
- [ ] `docker exec peer_review_api npm install`
- [ ] `cd frontend && npm install`
- [ ] `backend/.env` con `VAPID_PUBLIC_KEY` y `VAPID_PRIVATE_KEY`
- [ ] `docker compose up -d api --force-recreate`
- [ ] Migraciones: `migration-create-missing-tables`, `migration-push-subscriptions`, `migration-add-reviewers`
- [ ] Probar campana de notificaciones y **Sugerir con IA** en Editor
- [ ] (Opcional) Activar push y probar cambio de estado

Con esto, los cambios de IA y notificaciones deberían quedar alineados para todo el equipo.
