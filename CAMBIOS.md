# Cambios Implementados - Sistema de Autenticación y Admin Panel

## 📋 Resumen de Cambios

Se implementó un sistema completo de autenticación JWT con registro/login de usuarios y un panel de administración.

---

## 🔧 Backend (NestJS)

### Nuevos Archivos Creados

```
backend/src/auth/
├── auth.module.ts          # Módulo de autenticación
├── auth.controller.ts      # Endpoints /auth/login y /auth/register
├── auth.service.ts         # Lógica de autenticación JWT
├── dto/
│   ├── login.dto.ts        # Validación de login
│   └── register.dto.ts     # Validación de registro
├── guards/
│   └── jwt-auth.guard.ts   # Protección de rutas
└── strategies/
    └── jwt.strategy.ts     # Estrategia JWT Passport

backend/src/users/dto/
├── create-user.dto.ts      # DTO para crear usuarios (admin)
└── update-user.dto.ts      # DTO para actualizar usuarios
```

### Archivos Modificados

- `backend/src/users/entities/user.entity.ts`
  - Agregado campo `nombre`
  - Agregado rol `ADMIN` al enum
  - Implementado hash de contraseñas con bcryptjs
  
- `backend/src/users/users.controller.ts`
  - Agregados endpoints CRUD para gestión de usuarios (admin)
  - Protección con JwtAuthGuard
  
- `backend/src/users/users.service.ts`
  - Implementados métodos: create, update, remove
  
- `backend/src/app.module.ts`
  - Importado AuthModule
  
- `backend/src/main.ts`
  - Configuración CORS ampliada para frontend

### Dependencias Instaladas

```bash
cd backend
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcryptjs @types/bcryptjs --legacy-peer-deps
```

---

## 💻 Frontend (Vue 3)

### Nuevos Archivos Creados

```
frontend/src/views/
├── LoginView.vue         # Vista de inicio de sesión
├── RegisterView.vue      # Vista de registro con validaciones
└── AdminView.vue         # Panel de administración

frontend/src/stores/
└── auth.ts               # Store Pinia para autenticación
```

### Archivos Modificados

- `frontend/src/router/index.ts`
  - Agregadas rutas `/login`, `/register`, `/admin`
  - Implementado navigation guard para protección de rutas
  - Redirección automática según rol
  
- `frontend/src/main.ts`
  - Integración de Pinia
  - Inicialización de autenticación desde localStorage
  
- `frontend/src/views/AuthorView.vue`
  - Actualizado para usar auth store
  - Botón de logout funcional
  
- `frontend/src/views/ReviewerView.vue`
  - Agregado auth store y función logout
  
- `frontend/src/views/EditorView.vue`
  - Agregado auth store y función logout

### Dependencias Instaladas

```bash
cd frontend
npm install pinia --legacy-peer-deps
```

---

## 👤 Usuarios de Prueba (Seed)

La base de datos incluye estos usuarios pre-creados:

| Email | Rol | Contraseña | Nombre |
|-------|-----|------------|--------|
| autor@diego.edu | Autor | password123 | Ana García |
| revisor@diego.edu | Revisor | password123 | Carlos Martínez |
| editor@diego.edu | Editor | password123 | Laura Torres |
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

### Autenticación
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Inicio de sesión (retorna JWT)

### Usuarios (Requieren JWT Bearer Token)
- `GET /api/users` - Listar usuarios
- `POST /api/users` - Crear usuario (admin)
- `PATCH /api/users/:id` - Actualizar usuario (admin)
- `DELETE /api/users/:id` - Eliminar usuario (admin)

---

## 📝 Notas Técnicas

### JWT Token
- Expiración: 24 horas
- Almacenamiento: localStorage (token + user)
- Header: `Authorization: Bearer <token>`

### Roles Disponibles
- `Autor` - Puede registrar artículos
- `Revisor` - Puede revisar artículos asignados
- `Editor` - Puede gestionar el flujo editorial
- `Admin` - Puede gestionar usuarios (CRUD completo)

### CORS Configuración
- Orígenes permitidos: `http://localhost:5173`, `http://localhost:5174`
- Headers permitidos: `Content-Type`, `Accept`, `Authorization`
- Métodos: GET, POST, PUT, PATCH, DELETE, OPTIONS

---

## ⚠️ Troubleshooting

### Error "The network connection was lost"
Verificar que:
1. Docker containers estén corriendo: `docker ps`
2. Backend esté funcionando: `docker logs peer_review_api --tail 10`
3. No haya errores de CORS en consola del navegador

### Error de tipos en AdminView
Si hay errores TypeScript, recargar la página del navegador (`F5`).

### Usuario no redirige correctamente
Limpiar localStorage:
```javascript
localStorage.clear()
```
Y recargar la página.

---

## 📅 Fecha de Implementación
Abril 2026 - Sistema de Autenticación JWT v1.0
