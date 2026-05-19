# Bitácora de Cambios - Tablero de Estados de Artículos

## 📋 Resumen de Cambios

Se implementó un tablero de estados (dashboard) para el sistema de gestión de artículos de congreso con reglas de visibilidad según el rol del usuario.

---

## 🔧 Backend (NestJS)

### Nuevos Archivos Creados

```
backend/src/dashboard/
├── dashboard.module.ts          # Módulo de dashboard
├── dashboard.controller.ts      # Endpoint GET /api/dashboard
└── dashboard.service.ts         # Lógica de filtrado según rol
```

### Archivos Modificados

- `backend/src/users/entities/user.entity.ts`
  - Agregados roles `EDITOR_JEFE` y `SUB_EDITOR` al enum `Rol`
  - Eliminada referencia a entidad `Perfil` (limpieza de código antiguo)

- `backend/src/app.module.ts`
  - Importado `DashboardModule`

- `backend/src/database/seed.ts`
  - Eliminada referencia a entidad `Perfil`
  - Agregados usuarios de prueba para nuevos roles:
    - `editor-jefe@diego.edu` (EditorJefe)
    - `sub-editor1@diego.edu` (SubEditor)
    - `sub-editor2@diego.edu` (SubEditor)

### Lógica del Dashboard

#### Reglas de Visibilidad por Rol

**Editor en Jefe (EditorJefe):**
- Puede ver el estado de todos los artículos del congreso
- Puede filtrar artículos por sub-editor asignado
- Obtiene lista de sub-editores disponibles para el filtro

**Sub-Editor (SubEditor):**
- Solo puede ver artículos que él mismo asignó/tiene asignados
- No tiene visibilidad sobre artículos de otros sub-editores

**Editor (rol existente):**
- Mantiene comportamiento anterior (ve todos los artículos)

#### Endpoint API

- `GET /api/dashboard` - Obtiene datos del dashboard según rol del usuario autenticado
  - Query param opcional: `?sub_editor_id=<id>` (solo para EditorJefe)
  - Requiere JWT Bearer Token

---

## 💻 Frontend (Vue 3)

### Nuevos Archivos Creados

```
frontend/src/views/
└── DashboardView.vue            # Vista del dashboard con adaptación por rol
```

### Archivos Modificados

- `frontend/src/router/index.ts`
  - Agregada ruta `/dashboard`
  - Redirección automática para roles `EditorJefe` y `SubEditor` al login

### Funcionalidades del Dashboard

#### Adaptación por Rol

**Editor en Jefe:**
- Muestra estadísticas generales de artículos
- Tabla con todos los artículos y sus estados
- Filtro por sub-editor (dropdown)
- Columna "Asignado a" mostrando revisores asignados

**Sub-Editor:**
- Muestra solo artículos asignados a él
- Tabla con sus artículos y estados
- Columna "Fecha Límite" para asignaciones

#### Componentes de UI

- **Tarjetas de estadísticas:** Borrador, En Revisión, Aceptado, Rechazado
- **Tabla de artículos:** Con badges de estado coloridos
- **Filtro de sub-editor:** Solo visible para EditorJefe
- **Menú de usuario:** Con toggle de tema claro/oscuro y logout

---

## 👤 Usuarios de Prueba (Seed)

| Email | Rol | Contraseña | Nombre |
|-------|-----|------------|--------|
| autor@diego.edu | Autor | password123 | Ana García |
| revisor@diego.edu | Revisor | password123 | Carlos Martínez |
| editor@diego.edu | Editor | password123 | Laura Torres |
| editor-jefe@diego.edu | EditorJefe | password123 | Roberto Sánchez |
| sub-editor1@diego.edu | SubEditor | password123 | María López |
| sub-editor2@diego.edu | SubEditor | password123 | Pedro Ramírez |
| admin@diego.edu | Admin | admin123 | Administrador |

---

## 🚀 Pasos Necesarios para Aplicar Cambios

### 1. Reconstruir contenedores Docker

Desde la carpeta raíz del proyecto:

```bash
cd backend
docker-compose down -v  # Elimina volúmenes para recrear BD
docker-compose up -d --build
```

### 2. Ejecutar Seed de usuarios

```bash
docker exec peer_review_api npx ts-node src/database/seed.ts
```

### 3. Instalar dependencias del frontend (si no están instaladas)

```bash
cd frontend
npm install
```

### 4. Iniciar frontend

```bash
cd frontend
npm run dev
```

---

## 🔑 Endpoints de API

### Dashboard (Requiere JWT Bearer Token)
- `GET /api/dashboard` - Obtener datos del dashboard según rol
  - Query param opcional: `?sub_editor_id=<id>` (solo EditorJefe)

### Respuestas del Endpoint

**EditorJefe:**
```json
{
  "rol": "EditorJefe",
  "total_articulos": 10,
  "articulos": [...],
  "sub_editores": [
    { "id": "...", "nombre": "María López", "email": "sub-editor1@diego.edu" },
    { "id": "...", "nombre": "Pedro Ramírez", "email": "sub-editor2@diego.edu" }
  ],
  "estadisticas": {
    "por_estado": {
      "Borrador": 3,
      "En Revisión": 4,
      "Aceptado": 2,
      "Rechazado": 1
    },
    "total": 10
  }
}
```

**SubEditor:**
```json
{
  "rol": "SubEditor",
  "total_articulos": 5,
  "articulos": [
    {
      "id": "...",
      "titulo": "Artículo 1",
      "estado": "En Revisión",
      "autor": "Ana García",
      "fecha_limite": "2024-12-31"
    }
  ],
  "estadisticas": {
    "por_estado": { ... },
    "total": 5
  }
}
```

---

## 📝 Notas Técnicas

### Roles Disponibles
- `Autor` - Puede registrar artículos
- `Revisor` - Puede revisar artículos asignados
- `Editor` - Gestión editorial (comportamiento anterior)
- `EditorJefe` - Visibilidad total del congreso + filtro por sub-editor
- `SubEditor` - Solo ve sus artículos asignados
- `Admin` - Gestión de usuarios (CRUD completo)

### Estados de Artículos
- `Borrador` - Artículo en borrador
- `En Revisión` - Artículo en proceso de revisión
- `Aceptado` - Artículo aceptado
- `Rechazado` - Artículo rechazado

### Restricciones de Seguridad
- El endpoint `/api/dashboard` está protegido con `JwtAuthGuard`
- Los sub-editores solo pueden ver sus propias asignaciones
- El filtro por sub-editor solo funciona para EditorJefe
- No hay migraciones de base de datos necesarias (usamos TypeORM con synchronize: false)

---

## ⚠️ Troubleshooting

### Error "Rol no autorizado para dashboard"
Verifica que el usuario tenga uno de estos roles: EditorJefe, SubEditor, Editor

### Error 403 Forbidden
Verifica que el token JWT sea válido y esté en el header: `Authorization: Bearer <token>`

### El filtro de sub-editor no funciona
Verifica que el usuario tenga rol `EditorJefe` y que el parámetro `sub_editor_id` sea un UUID válido

### Los nuevos roles no aparecen en el frontend
Verifica que:
1. El seed se ejecutó correctamente
2. El usuario se registró con el rol correcto
3. El token JWT contiene el rol correcto (decodificar el token JWT para verificar)

---

## 📅 Fecha de Implementación
Mayo 2026 - Tablero de Estados de Artículos v1.0
