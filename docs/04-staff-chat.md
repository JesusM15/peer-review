# Staff Chat - Chat Interno por Congreso

## 📋 Descripción

El Staff Chat es un sistema de mensajería en tiempo real (WebSocket) que permite la comunicación interna entre Editores y Administradores de un congreso. Los mensajes se persisten en MongoDB y están disponibles para usuarios con roles de `Editor` o `Admin`.

## 🚀 Instalación y Configuración

### 1. Dependencias del Backend

El backend requiere las siguientes dependencias (ya incluidas en `package.json`):

```json
{
  "@nestjs/platform-socket.io": "^11.1.21",
  "@nestjs/websockets": "^11.1.21",
  "socket.io": "^4.8.3"
}
```

Si faltan, instálalas:

```bash
cd backend
npm install @nestjs/platform-socket.io @nestjs/websockets socket.io
```

### 2. Dependencias del Frontend

El frontend requiere:

```json
{
  "socket.io-client": "^4.7.2"
}
```

Si falta, instálala:

```bash
cd frontend
npm install socket.io-client
```

### 3. Configuración del Backend

El módulo `StaffChatModule` ya está importado en `app.module.ts`. Asegúrate de que:

```typescript
import { StaffChatModule } from './staff-chat/staff-chat.module';

@Module({
  imports: [
    // ... otros módulos
    StaffChatModule,
  ],
})
export class AppModule {}
```

### 4. Variables de Entorno

No se requieren variables de entorno adicionales. El chat usa las mismas configuraciones que el resto del proyecto:

- `JWT_SECRET`: Para autenticación WebSocket
- `MONGODB_URI`: Para persistencia de mensajes

## 📁 Estructura de Archivos

### Backend
```
backend/src/staff-chat/
├── schemas/
│   └── staff-message.schema.ts    # Esquema Mongoose para mensajes
├── staff-chat.controller.ts       # Endpoint HTTP para historial
├── staff-chat.gateway.ts          # Gateway WebSocket
├── staff-chat.module.ts           # Módulo NestJS
└── staff-chat.service.ts          # Lógica de negocio
```

### Frontend
```
frontend/src/
├── components/
│   └── StaffChat.vue              # Componente UI del chat
└── composables/
    └── useStaffChat.ts            # Hook personalizado para WebSocket
```

## 🔐 Requisitos de Acceso

### Roles Permitidos
- **Editores y Admins**: Pueden leer y enviar mensajes
- **Revisores**: Pueden leer mensajes (solo lectura), pero no pueden enviar

Solo usuarios con roles `Editor`, `Admin` o `Revisor` pueden acceder al chat de un congreso.

### Asignación de Roles

Para asignar un usuario como Editor/Admin de un congreso, inserta un registro en `usuario_congreso_rol`:

```sql
INSERT INTO usuario_congreso_rol (id, user_id, congreso_id, rol)
VALUES (
  UUID(),
  'USER_ID_DEL_USUARIO',
  'CONGRESSO_ID',
  'Editor'  -- o 'Admin'
);
```

Ejemplo para ejecutar en Docker:

```bash
docker exec -it peer_review_mariadb mysql -udbuser -pdbpassword peer_review_db
```

## 🎯 Cómo Usar

### Para Usuarios

1. **Inicia sesión** con una cuenta que tenga rol `Editor` o `Admin`
2. **Selecciona un congreso** donde tengas membresía como Editor/Admin
3. **Navega a "Chat del Staff"** en el menú del Editor
4. **Envía mensajes** en tiempo real

### Para Desarrolladores

#### Uso del Componente

```vue
<template>
  <StaffChat 
    :congresoId="congressId" 
    :jwt="authToken" 
  />
</template>

<script setup>
import StaffChat from '@/components/StaffChat.vue';
</script>
```

#### Uso del Hook

```typescript
import { useStaffChat } from '@/composables/useStaffChat';

const { 
  connect, 
  disconnect, 
  connected, 
  messages, 
  sendMessage,
  loadHistory 
} = useStaffChat(congresoId, jwtToken);

// Conectar al chat
connect();

// Enviar mensaje
sendMessage('Hola equipo');

// Cargar historial
await loadHistory(50);
```

## 🔧 Solución de Problemas

### El WebSocket no conecta

**Síntoma:** Estado "Desconectado" en la UI

**Causas posibles:**
1. Token JWT no válido o ausente
2. Usuario no es Editor/Admin/Revisor del congreso
3. Backend no está corriendo

**Solución:**
1. Verifica que estés logueado y el token sea válido
2. Verifica tu rol en la base de datos:
   ```sql
   SELECT * FROM usuario_congreso_rol WHERE user_id = 'TU_USER_ID';
   ```
3. Asegúrate que el contenedor Docker esté corriendo:
   ```bash
   docker-compose ps
   ```

### No puedo enviar mensajes (input deshabilitado)

**Síntoma:** El input de mensajes está deshabilitado y muestra "Solo lectura - Eres Revisor"

**Causa:** Tu rol es `Revisor`, que solo tiene permisos de lectura

**Solución:** Si necesitas enviar mensajes, solicita que tu rol sea cambiado a `Editor` o `Admin`

### Error "secret or public key must be provided"

**Causa:** El `JwtService` no tiene configurado el secret

**Solución:** Verifica que `JWT_SECRET` esté configurado en `.env` o usa el valor por defecto

### Los mensajes no se persisten

**Causa:** MongoDB no está corriendo o no hay conexión

**Solución:**
1. Verifica que MongoDB esté corriendo:
   ```bash
   docker-compose ps | grep mongodb
   ```
2. Revisa los logs del backend:
   ```bash
   docker logs peer_review_api
   ```

### Error 401 al cargar historial

**Causa:** El endpoint HTTP no está recibiendo el token JWT

**Solución:** El frontend ya incluye el token en los headers. Verifica que `authStore.token` tenga un valor válido.

## 🧪 Testing

### Probar con Dos Usuarios

1. **Crea dos usuarios** con rol `Editor` o `Admin`
2. **Asigna ambos al mismo congreso**
3. **Abre dos ventanas del navegador** (una normal, una incógnito)
4. **Loguea cada usuario en una ventana**
5. **Navega al chat del mismo congreso en ambas**
6. **Envía mensajes** y verifica que aparezcan en ambas ventanas

### Verificar Conexión WebSocket

Abre la consola del navegador (F12) y busca:

```
Connecting to WebSocket: http://localhost:3000 with congresoId: ... token: present
WebSocket connected successfully
```

## 📊 Endpoints API

### GET /api/staff-chat/:congresoId/history

Obtiene el historial de mensajes de un congreso.

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

**Query Params:**
- `limit`: Número de mensajes (default: 50)
- `before`: Timestamp ISO para paginación (opcional)

**Response:**
```json
[
  {
    "_id": "...",
    "congreso_id": "...",
    "sender_id": "...",
    "sender_name": "...",
    "content": "...",
    "createdAt": "2024-05-19T12:00:00.000Z",
    "readBy": []
  }
]
```

## 🔌 Eventos WebSocket

### Client → Server

- `message`: Enviar un mensaje
  ```typescript
  socket.emit('message', { congresoId, content });
  ```

- `typing`: Indicar que está escribiendo
  ```typescript
  socket.emit('typing', { congresoId });
  ```

### Server → Client

- `message`: Recibir un mensaje
- `typing`: Alguien está escribiendo

## 🎨 Personalización

### Colores del Chat

Los colores se pueden modificar en `StaffChat.vue`:

```css
/* Tus mensajes */
.message-row.mine .msg-bubble { 
  background: #000000; 
  color: #ffffff; 
}

/* Mensajes de otros */
.msg-bubble { 
  background: var(--bg-input); 
  color: var(--text-normal); 
}
```

## 📝 Notas Importantes

1. **Rate Limiting:** El frontend tiene un rate limit de 5 mensajes cada 10 segundos
2. **Persistencia:** Todos los mensajes se guardan en MongoDB
3. **Seguridad:** Solo usuarios autorizados pueden unirse a la sala del chat
4. **Historial:** El historial se carga paginado (50 mensajes por defecto)
5. **Scroll Infinito:** Implementado con IntersectionObserver para cargar mensajes antiguos

## 🔄 Mantenimiento

### Reiniciar el Servicio

```bash
docker-compose restart api
```

### Ver Logs en Tiempo Real

```bash
docker logs -f peer_review_api
```

### Limpiar Mensajes Antiguos

```javascript
// En MongoDB shell
db.staffmessages.deleteMany({
  createdAt: { $lt: new Date(Date.now() - 30*24*60*60*1000) }
})
```

## 📚 Referencias

- [NestJS WebSockets](https://docs.nestjs.com/websockets/gateways)
- [Socket.IO Documentation](https://socket.io/docs/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
