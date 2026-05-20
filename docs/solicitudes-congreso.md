# Solicitudes de Congreso (Gobernanza para Creación de Eventos)

**Autor:** Diego Bejarano
**Fecha:** 2026-05-19
**Rama:** `diego`
**Commit del feature:** `1595854 feat: governance flow para solicitar y aprobar congresos`

---

## 1. Resumen

Se implementa un flujo de gobernanza para la creación de congresos. Antes de este cambio, no existía un proceso oficial para que un usuario propusiera un nuevo congreso: o se creaba directamente desde la base de datos o por intervención manual del Administrador. Ahora cualquier usuario autenticado puede **solicitar** la creación de un congreso desde la UI, el Administrador recibe una **notificación** y al **aprobar** la solicitud el sistema:

1. Crea automáticamente el registro en la tabla `congresos`.
2. Asigna al solicitante el rol `Editor` sobre ese congreso (Editor en Jefe) a través de la tabla `usuario_congreso_rol`.
3. Notifica al solicitante con el resultado (Aprobado o Rechazado).

Diagrama del flujo (texto):

```
Usuario autenticado
        |
        | POST /api/solicitudes-congreso
        v
+------------------------+
| solicitudes_congreso   |  estado = 'Pendiente'
+------------------------+
        |
        | notificaciones (tipo=SOLICITUD_NUEVO) -> Admin
        v
   Admin revisa
        |
        | PATCH /api/solicitudes-congreso/:id/resolver
        v
   estado = Aprobado?
        |--- Sí ---> congresos (nuevo) + usuario_congreso_rol (rol=Editor) + notificacion al solicitante (SOLICITUD_APROBADO)
        |--- No --->                                                       notificacion al solicitante (SOLICITUD_RECHAZADO)
```

---

## 2. Justificación general

| Decisión | Por qué |
|---|---|
| Tabla nueva `solicitudes_congreso` en vez de campo `pendiente` en `congresos` | Mantiene `congresos` como la tabla de eventos *reales*. Las solicitudes son entidades del proceso de gobernanza, tienen estados propios (Pendiente/Aprobado/Rechazado) y datos exclusivos (motivo, respuesta_admin, fecha_resolucion) que no aplican a un congreso ya activo. |
| Reutilizar el enum existente `Rol.EDITOR` para el "Editor en Jefe" | En la arquitectura del Sprint 3 el rol editorial más alto por congreso es `Editor` a través de `usuario_congreso_rol`. No se introduce un enum nuevo (`EDITOR_EN_JEFE`) para no fragmentar el modelo de roles. La distinción "Editor en Jefe" vs "Editor de Sección" se mantiene por el contexto (sin `editor_tags` específicos = Jefe; con `editor_tags` = Sección). |
| Módulo independiente `notificaciones` | Las notificaciones se disparan desde varios eventos (creación de solicitud, aprobación, rechazo) y previsiblemente desde otras features (revisiones, asignaciones, etc.). Aislarlo en su propio módulo permite reutilizarlo sin acoplamiento. |
| `class-validator` en DTOs | Sigue las "Buenas Prácticas y Reglas Técnicas" definidas en `AGENT.md`: "DTOs Estrictos: Uso de `class-validator` y `class-transformer`. No se procesa data sin contrato". |
| Endpoints protegidos con `JwtAuthGuard` | Toda la API ya usa JWT vía `AuthModule`. Se reutiliza la misma estrategia; el control de admin se hace en la capa de servicio (chequeo de `request.user.rol === Rol.ADMIN`). |
| Script de migración manual `migration-solicitudes-congreso.ts` | Sigue el patrón ya establecido en `migration-sprint-3.ts` y `migration-solicitudes.ts`. Permite crear las tablas en entornos con `synchronize: false` (recomendado en producción). |
| Estética B&N + Lucide en frontend | Cumple con `AGENT.md`: "Paleta Estrictamente B&N", "Iconografía: Uso exclusivo de Lucide Vue Next", "No usar emojis", "Botones sin bordes redondeados excesivos (máximo 4px)". |

---

## 3. Cambios en el Backend (NestJS)

### 3.1 Módulo nuevo: `solicitudes-congreso`

Ubicación: `backend/src/solicitudes-congreso/`

```
solicitudes-congreso/
├── dto/
│   ├── create-solicitud-congreso.dto.ts
│   └── resolve-solicitud-congreso.dto.ts
├── entities/
│   └── solicitud-congreso.entity.ts
├── solicitudes-congreso.controller.ts
├── solicitudes-congreso.service.ts
└── solicitudes-congreso.module.ts
```

#### Entidad `SolicitudCongreso`

Tabla: `solicitudes_congreso`. Campos:

| Campo | Tipo | Notas |
|---|---|---|
| `id` | VARCHAR(36) PK | UUID generado en backend (alineado con la estrategia offline-first de UUIDs cliente del proyecto). |
| `solicitante_id` | VARCHAR(36) FK -> `users.id` | Autor de la solicitud. |
| `nombre_propuesto` | VARCHAR(150) NOT NULL | Nombre tentativo del congreso. |
| `descripcion_propuesta` | TEXT NULL | Resumen del evento. |
| `fecha_inicio_propuesta` | DATE NULL | Fecha tentativa de inicio. |
| `fecha_fin_propuesta` | DATE NULL | Fecha tentativa de fin. |
| `motivo` | TEXT NULL | Justificación del solicitante. |
| `estado` | VARCHAR(50) NOT NULL DEFAULT 'Pendiente' | Enum lógico: `Pendiente`, `Aprobado`, `Rechazado`. |
| `respuesta_admin` | TEXT NULL | Comentario del Admin al resolver. |
| `congreso_creado_id` | VARCHAR(36) NULL FK -> `congresos.id` | Apunta al congreso creado si fue aprobada. |
| `fecha_creacion` | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP | |
| `fecha_resolucion` | TIMESTAMP NULL | Se llena al aprobar o rechazar. |

Índices:
- `idx_solicitudes_congreso_estado (estado)` — para listar pendientes rápido.
- `idx_solicitudes_congreso_solicitante (solicitante_id)` — para listar "mis solicitudes".

#### DTOs

- `CreateSolicitudCongresoDto`: `nombre_propuesto` (`@IsString @IsNotEmpty`), `descripcion_propuesta` (`@IsOptional @IsString`), `fecha_inicio_propuesta`, `fecha_fin_propuesta`, `motivo`.
- `ResolveSolicitudCongresoDto`: `estado` (`@IsIn(['Aprobado','Rechazado'])`), `respuesta_admin` (`@IsOptional @IsString`).

#### Service (`SolicitudesCongresoService`)

Métodos principales:

| Método | Descripción |
|---|---|
| `create(userId, dto)` | Persiste una nueva solicitud en estado `Pendiente`. Dispara `notificacionesService.notificarAdmins(...)`. |
| `findByUser(userId)` | Listado para "mis solicitudes" del solicitante. |
| `findAllPending()` | Listado para el Admin (pestaña "Solicitudes de Congreso", filtro por defecto). |
| `findAll()` | Listado completo (histórico) para el Admin. |
| `findByIdAndAuthCheck(id, user)` | Lectura individual con verificación de permisos (admin o dueño). |
| `resolve(id, dto, adminUser)` | **Núcleo del feature.** Lógica al aprobar/rechazar. |

Lógica de `resolve()` (resumen):

```
1. Cargar la solicitud y validar que esté en estado 'Pendiente'.
2. Si dto.estado === 'Aprobado':
   a. INSERT en `congresos` con nombre_propuesto, descripcion_propuesta, fecha_inicio/fin (si se proveyeron).
   b. INSERT en `usuario_congreso_rol` con (user_id=solicitante_id, congreso_id=nuevo, rol=Editor).
   c. UPDATE solicitud: estado='Aprobado', congreso_creado_id=nuevo, respuesta_admin, fecha_resolucion=now().
   d. notificacionesService.notificarSolicitante(solicitante_id, tipo=SOLICITUD_APROBADO, link=/editor).
3. Si dto.estado === 'Rechazado':
   a. UPDATE solicitud: estado='Rechazado', respuesta_admin, fecha_resolucion=now().
   b. notificacionesService.notificarSolicitante(solicitante_id, tipo=SOLICITUD_RECHAZADO).
```

Las operaciones (a + b + c) se realizan dentro de un `queryRunner.startTransaction()` para garantizar atomicidad: si la creación del congreso falla, no se asigna el rol ni se marca la solicitud como aprobada.

#### Controller (`SolicitudesCongresoController`)

Todas las rutas montadas en `/api/solicitudes-congreso` y protegidas con `@UseGuards(JwtAuthGuard)`.

| Método | Ruta | Quién | Body | Respuesta |
|---|---|---|---|---|
| `POST` | `/` | Cualquier usuario autenticado | `CreateSolicitudCongresoDto` | `SolicitudCongreso` con estado `Pendiente`. |
| `GET` | `/mias` | Cualquier usuario autenticado | — | Array de solicitudes del usuario actual. |
| `GET` | `/` | Admin-only | — | Array de todas las solicitudes. |
| `GET` | `/pendientes` | Admin-only | — | Array de solicitudes en estado `Pendiente`. |
| `GET` | `/:id` | Admin o dueño | — | Una `SolicitudCongreso`. |
| `PATCH` | `/:id/resolver` | Admin-only | `ResolveSolicitudCongresoDto` | Solicitud actualizada (con `congreso_creado_id` si fue aprobada). |

Se utiliza un tipo `AuthRequest` (declarado en `backend/src/auth/types/auth-request.type.ts`) para tipar correctamente `@Request()` y evitar `any` en el controller.

### 3.2 Módulo nuevo: `notificaciones`

Ubicación: `backend/src/notificaciones/`

```
notificaciones/
├── entities/
│   └── notificacion.entity.ts
├── notificaciones.controller.ts
├── notificaciones.service.ts
└── notificaciones.module.ts
```

#### Entidad `Notificacion`

Tabla: `notificaciones`. Campos:

| Campo | Tipo | Notas |
|---|---|---|
| `id` | VARCHAR(36) PK | UUID. |
| `user_id` | VARCHAR(36) FK -> `users.id` | Destinatario. |
| `tipo` | VARCHAR(80) | Enum lógico: `SOLICITUD_NUEVO`, `SOLICITUD_APROBADO`, `SOLICITUD_RECHAZADO` (extensible). |
| `titulo` | VARCHAR(200) | Texto corto. |
| `mensaje` | TEXT | Texto del cuerpo. |
| `link` | VARCHAR(255) NULL | Ruta del frontend a la que dirige al hacer click. |
| `leida` | TINYINT(1) NOT NULL DEFAULT 0 | Flag de "ya la vi". |
| `fecha_creacion` | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP | |

Índices:
- `idx_notificaciones_user (user_id)` — listar por usuario.
- `idx_notificaciones_user_leida (user_id, leida)` — contar no leídas rápido.

#### Service (`NotificacionesService`)

Métodos principales: `crear(...)`, `notificarAdmins(...)`, `notificarSolicitante(...)`, `findByUser(userId)`, `contarNoLeidas(userId)`, `marcarLeida(id, userId)`, `marcarTodasLeidas(userId)`.

#### Controller

Rutas en `/api/notificaciones`, todas con `JwtAuthGuard`:

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/` | Notificaciones del usuario actual (más nuevas primero). |
| `GET` | `/contar-no-leidas` | `{ count: number }`. Usado por la campana del topbar. |
| `PATCH` | `/:id/leer` | Marca una como leída. |
| `PATCH` | `/leer-todas` | Marca todas las del usuario como leídas. |

### 3.3 Otros cambios en el backend

- `backend/src/app.module.ts`: se importan `SolicitudesCongresoModule` y `NotificacionesModule`.
- `backend/src/auth/types/auth-request.type.ts`: tipo nuevo para tipar `@Request()` (evita `any` en los controllers).
- `backend/src/database/migration-solicitudes-congreso.ts`: script de migración manual (ver sección 4).

---

## 4. Migración

### 4.1 Script

Archivo: `backend/src/database/migration-solicitudes-congreso.ts`

Crea dos tablas (`solicitudes_congreso` y `notificaciones`) con sus índices. Usa `CREATE TABLE IF NOT EXISTS` para ser idempotente (se puede correr múltiples veces sin error).

### 4.2 SQL aplicado por el script

```sql
CREATE TABLE IF NOT EXISTS solicitudes_congreso (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  solicitante_id VARCHAR(36) NOT NULL,
  nombre_propuesto VARCHAR(150) NOT NULL,
  descripcion_propuesta TEXT NULL,
  fecha_inicio_propuesta DATE NULL,
  fecha_fin_propuesta DATE NULL,
  motivo TEXT NULL,
  estado VARCHAR(50) NOT NULL DEFAULT 'Pendiente',
  respuesta_admin TEXT NULL,
  congreso_creado_id VARCHAR(36) NULL,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_resolucion TIMESTAMP NULL,
  INDEX idx_solicitudes_congreso_estado (estado),
  INDEX idx_solicitudes_congreso_solicitante (solicitante_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS notificaciones (
  id VARCHAR(36) NOT NULL PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  tipo VARCHAR(80) NOT NULL,
  titulo VARCHAR(200) NOT NULL,
  mensaje TEXT NOT NULL,
  link VARCHAR(255) NULL,
  leida TINYINT(1) NOT NULL DEFAULT 0,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_notificaciones_user (user_id),
  INDEX idx_notificaciones_user_leida (user_id, leida)
) ENGINE=InnoDB;
```

### 4.3 Cómo ejecutar la migración

Antes de correrla, asegúrate de que el backend esté **compilado** y de que MariaDB esté corriendo (vía `docker compose up -d`).

#### Opción 1: Vía contenedor Docker (recomendada)

Desde la raíz del proyecto, con el stack de Docker arriba:

```bash
docker compose exec api node dist/database/migration-solicitudes-congreso.js
```

> Reemplaza `api` por el nombre real del servicio del backend si en tu `docker-compose.yml` se llama distinto (revisa con `docker compose ps`).

Salida esperada:

```
Conectado a la base de datos...
Creando tabla solicitudes_congreso...
Tabla solicitudes_congreso creada.
Creando tabla notificaciones...
Tabla notificaciones creada.
Migración finalizada.
```

#### Opción 2: Vía `ts-node` (sin necesidad de compilar)

```bash
docker compose exec api npx ts-node src/database/migration-solicitudes-congreso.ts
```

#### Opción 3: Local sin Docker

Desde `backend/` (con la BD accesible en `localhost:3307`):

```bash
cd backend
npm install                  # solo la primera vez
npx ts-node src/database/migration-solicitudes-congreso.ts
```

#### Opción 4: TypeORM `synchronize: true` (solo desarrollo)

Si en `backend/src/app.module.ts` tienes `synchronize: true`, al arrancar el backend (`npm run start:dev` o `docker compose up -d --build`) TypeORM creará las tablas automáticamente a partir de las entities. **No usar en producción** porque puede borrar datos si una entidad cambia.

### 4.4 Verificar que las tablas se crearon

```bash
docker compose exec mariadb mariadb -udbuser -pdbpassword peer_review_db -e "show tables"
```

Deben aparecer `solicitudes_congreso` y `notificaciones` en la lista junto con las tablas existentes (`users`, `congresos`, `articulos`, etc.).

### 4.5 Rollback

Si necesitas deshacer la migración (por ejemplo, para reaplicarla limpia):

```sql
DROP TABLE IF EXISTS notificaciones;
DROP TABLE IF EXISTS solicitudes_congreso;
```

> Atención: esto borra todas las solicitudes y notificaciones existentes.

---

## 5. Cambios en el Frontend (Vue 3 + Vite)

### 5.1 Vista nueva: `SolicitarCongresoView.vue`

Ubicación: `frontend/src/views/SolicitarCongresoView.vue`. Ruta: `/solicitar-congreso`.

Contiene:
- Formulario para enviar una nueva solicitud (`nombre_propuesto`, `descripcion_propuesta`, `fecha_inicio_propuesta`, `fecha_fin_propuesta`, `motivo`).
- Historial de solicitudes del usuario actual con badge de estado (`Pendiente`, `Aprobado`, `Rechazado`).
- Validación cliente: nombre requerido, fechas ordenadas correctamente.

### 5.2 Botón "Solicitar nuevo congreso" en `CongressSelectionView.vue`

Se añade un botón en el header de la vista de selección de congresos. Al click navega a `/solicitar-congreso`.

### 5.3 Pestaña "Solicitudes de Congreso" en `AdminView.vue`

Nueva sección dentro del Admin:
- Item de navegación con badge azul (`#0070f3`) mostrando el contador de solicitudes pendientes.
- Filtros: "Pendientes" / "Todas".
- Tarjetas de solicitud con: avatar del autor, título, badge de estado, descripción, fechas propuestas, motivo, y (si aplica) `respuesta_admin`.
- Botones "Aprobar" / "Rechazar" en solicitudes en estado `Pendiente`. Al aprobar se pide opcionalmente un comentario que se guarda en `respuesta_admin`.

### 5.4 Campana de notificaciones en el topbar del Admin

- Icono `Bell` de Lucide con badge azul (`#0070f3`) y contador de no leídas.
- Click abre dropdown con lista de notificaciones (más recientes primero).
- Botón "Marcar todas como leídas".
- Cada notificación al hacer click navega a su `link` (típicamente `/admin/solicitudes-congreso`).

### 5.5 Router

`frontend/src/router/index.ts`: se registra la ruta:

```typescript
{
  path: '/solicitar-congreso',
  name: 'SolicitarCongreso',
  component: () => import('../views/SolicitarCongresoView.vue'),
  meta: { requiresAuth: true }
}
```

Se ajusta el navigation guard para permitir acceder a `/solicitar-congreso` sin necesidad de tener un `currentCongressId` previo (porque la idea de la vista es justamente cuando aún no existe un congreso del usuario).

### 5.6 Estética

Toda la UI nueva sigue las reglas de `AGENT.md`:
- Paleta estrictamente B&N (fondo `#000`/`#fff`, bordes `1px solid #333` / `#eaeaea`).
- Acento Azul Vercel `#0070f3` exclusivamente para acciones primarias (badges, botón "Enviar solicitud", botón "Aprobar").
- Iconografía Lucide Vue Next (`Bell`, `Plus`, `Check`, `X`, etc.), `stroke-width: 1.5`.
- Sin emojis.
- Bordes redondeados `4px` máximo.
- Espaciado en múltiplos de 4.

---

## 6. Flujo de prueba end-to-end (smoke test)

1. Levantar el stack:
   ```bash
   docker compose up -d --build
   ```
2. Correr la migración (sección 4.3) si `synchronize: false`.
3. Arrancar el frontend en modo dev:
   ```bash
   cd frontend && npm install && npm run dev
   ```
4. Abrir `http://localhost:5173`, registrarse o loguearse con un usuario no-admin.
5. Click en "Solicitar nuevo congreso" en la pantalla de selección. Llenar el formulario y enviar.
6. Verificar que aparezca toast de éxito y que la solicitud salga en el historial con badge `Pendiente`.
7. En otra sesión / pestaña, loguearse como un usuario con rol `Admin`.
8. Verificar:
   - Badge azul con `1` junto a la pestaña "Solicitudes de Congreso" en el nav.
   - Badge azul con `1` en la campana del topbar.
   - Al abrir la campana, aparece la notificación "Nueva solicitud de congreso".
9. Click en la pestaña "Solicitudes de Congreso", aprobar la solicitud (con respuesta opcional).
10. Verificar (vía DB o re-login del solicitante):
    - Nueva fila en `congresos`.
    - Nueva fila en `usuario_congreso_rol` con `rol='Editor'` y `user_id=solicitante`.
    - La solicitud queda en estado `Aprobado` con `congreso_creado_id` apuntando al nuevo congreso.
    - El solicitante recibe una notificación `SOLICITUD_APROBADO`.

---

## 7. Lista de archivos creados / modificados

**Creados (backend)**

- `backend/src/auth/types/auth-request.type.ts`
- `backend/src/database/migration-solicitudes-congreso.ts`
- `backend/src/notificaciones/entities/notificacion.entity.ts`
- `backend/src/notificaciones/notificaciones.controller.ts`
- `backend/src/notificaciones/notificaciones.module.ts`
- `backend/src/notificaciones/notificaciones.service.ts`
- `backend/src/solicitudes-congreso/dto/create-solicitud-congreso.dto.ts`
- `backend/src/solicitudes-congreso/dto/resolve-solicitud-congreso.dto.ts`
- `backend/src/solicitudes-congreso/entities/solicitud-congreso.entity.ts`
- `backend/src/solicitudes-congreso/solicitudes-congreso.controller.ts`
- `backend/src/solicitudes-congreso/solicitudes-congreso.module.ts`
- `backend/src/solicitudes-congreso/solicitudes-congreso.service.ts`

**Creados (frontend)**

- `frontend/src/views/SolicitarCongresoView.vue`

**Modificados**

- `backend/src/app.module.ts` (registra los dos módulos nuevos).
- `frontend/src/router/index.ts` (nueva ruta `/solicitar-congreso`).
- `frontend/src/views/AdminView.vue` (pestaña + campana de notificaciones).
- `frontend/src/views/CongressSelectionView.vue` (botón "Solicitar nuevo congreso").

---

## 8. Referencias

- Commit del feature: `1595854 feat: governance flow para solicitar y aprobar congresos`.
- PR a master: ver pestaña "Pull requests" del repo.
- Documentación arquitectónica relacionada: `docs/sprint-3-jesusm.md` (sistema `usuario_congreso_rol`), `docs/02-arquitectura-backend.md` (patrones NestJS), `AGENT.md` (guía de estilo y reglas).
