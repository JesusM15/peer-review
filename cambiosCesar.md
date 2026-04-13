# Cambios Realizados - Corrección de Sistema de Autenticación

## 📋 Resumen

Se corrigieron errores en el sistema de autenticación JWT que causaban "Credenciales inválidas" al intentar iniciar sesión con los usuarios de prueba.

---

## 🔧 Archivos Modificados

### `frontend/src/views/AuthorView.vue`

#### Problema: Vue Warning - Property "borradores" not defined
**Error en consola:**
```
[Vue warn]: Property "borradores" was accessed during render but is not defined on instance.
AuthorView.vue:180 Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'length')
```

**Causa:** La propiedad `borradores` se usaba en el template (línea 180) pero no estaba definida en la sección `<script>`.

**Solución:** Agregar la propiedad computada `borradores` que filtra los artículos con estado "Borrador".

```typescript
// LÍNEAS 366-369 - Agregar propiedad computada
const borradores = computed(() => {
  return articulos.value.filter(a => a.estado === 'Borrador')
})
```

---

### `backend/src/database/seed.ts`

#### Problema 1: Error de Metadatos de TypeORM
**Error:** `TypeORMError: Entity metadata for User#perfil was not found`

**Causa:** El `DataSource` en `seed.ts` no incluía la entidad `Perfil`, aunque la entidad `User` tiene una relación `@OneToOne` con ella.

**Solución:** Agregar la entidad `Perfil` al DataSource.

```typescript
// LÍNEA 3 - Agregar import
import { Perfil } from '../users/entities/perfil.entity';
```

```typescript
// LÍNEA 18 - Agregar Perfil al array de entidades
const AppDataSource = new DataSource({
  type: 'mariadb',
  url: process.env.MARIADB_URI || 'mysql://dbuser:dbpassword@mariadb:3306/peer_review_db',
  entities: [User, Perfil, Articulo, Asignacion],  // <-- Se agregó Perfil
  synchronize: true,
});
```

---

#### Problema 2: Contraseñas en Texto Plano
**Error:** Los usuarios existentes tenían contraseñas almacenadas en texto plano, pero el sistema de login usa bcrypt para comparar contraseñas hasheadas.

**Causa:** Si el seed se ejecutó antes de implementar el hash de contraseñas (`@BeforeInsert`), las contraseñas quedaron en texto plano y bcrypt.compare() siempre fallaba.

**Solución:** Modificar el seed para eliminar usuarios existentes antes de recrearlos, asegurando que el hook `@BeforeInsert` hashee las contraseñas correctamente.

```typescript
// LÍNEAS 61-88 - Lógica modificada para recrear usuarios
for (const seed of SEED_USERS) {
  // Buscar usuario por email (para detectar si existe aunque el ID cambie)
  const existingUserByEmail = await userRepo.findOne({ where: { email: seed.email } });
  
  if (existingUserByEmail) {
    // Eliminar usuario existente para recrearlo con contraseña hasheada
    await userRepo.remove(existingUserByEmail);
    console.log(`🗑️  Usuario existente eliminado: ${seed.email} (será recreado con hash)`);
  }

  // También verificar por ID por si cambió el email
  const existingUserById = await userRepo.findOne({ where: { id: seed.id } });
  if (existingUserById && existingUserById.email !== seed.email) {
    await userRepo.remove(existingUserById);
    console.log(`🗑️  Usuario con ID existente eliminado: ${existingUserById.email}`);
  }

  // Crear usuario nuevo (la contraseña se hashea automáticamente por @BeforeInsert)
  const user = userRepo.create({
    id: seed.id,
    nombre: seed.nombre,
    email: seed.email,
    password: seed.password,
    rol: seed.rol,
  });
  await userRepo.save(user);

  console.log(`✅ Usuario creado: ${seed.email} [${seed.rol}] — ID: ${seed.id}`);
}
```

---

## 🧪 Pasos para Aplicar los Cambios

### 1. Reconstruir los contenedores Docker

```bash
cd backend
docker-compose down -v
docker-compose up -d --build
```

### 2. Esperar a que los contenedores estén saludables

Verificar con:
```bash
docker ps
```

Debes ver `peer_review_mariadb` con estado **Healthy**.

### 3. Ejecutar el seed para recrear usuarios

```bash
docker exec peer_review_api npx ts-node src/database/seed.ts
```

Deberías ver:
```
🌱 Conectando a MariaDB...
✅ Conectado.
✅ Usuario creado: autor@diego.edu [Autor]
✅ Usuario creado: revisor@diego.edu [Revisor]
✅ Usuario creado: editor@diego.edu [Editor]
✅ Usuario creado: admin@diego.edu [Admin]
🎉 Seed completado.
```

### 4. Iniciar el frontend

```bash
cd frontend
npm run dev
```

### 5. Probar login

Usuarios de prueba:

| Email | Rol | Contraseña |
|-------|-----|------------|
| autor@diego.edu | Autor | password123 |
| revisor@diego.edu | Revisor | password123 |
| editor@diego.edu | Editor | password123 |
| admin@diego.edu | Admin | admin123 |

---

## 📝 Notas Técnicas

### Entidad User con Hash de Contraseñas

El hash automático funciona gracias al decorador `@BeforeInsert`:

```typescript
@Entity('users')
export class User {
  // ... otros campos ...

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  async validatePassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.password);
  }
}
```

Cuando se llama `userRepo.save(user)`, TypeORM ejecuta automáticamente `hashPassword()` antes de insertar, transformando la contraseña de texto plano a un hash bcrypt.

---

## 📅 Fecha de Corrección

Abril 2026 - Corrección de errores de autenticación v1.1
