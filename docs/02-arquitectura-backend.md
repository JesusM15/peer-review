# 🏛️ Arquitectura del Backend Universitario (NestJS)

¡Hola equipo! Nuestro backend vive dentro de un entorno ultra-organizado llamado **NestJS**. En NestJS nada vuela suelto, todo el código tiene un propósito súper específico y se organiza mediante archivos terminados en un nombre distintivo. 

Para que el proyecto esté sano, mantenible y todos nos entendamos, aquí te explico "qué es qué" haciendo una analogía con una cocina de restaurante.

---

## 📚 El Diccionario de Archivos del Backend

### 1. 🗂️ Los Archivos `.module.ts` (Los Gerentes del Restaurante)
* **¿Qué hacen?** No cocinan ni atienden, pero arman el equipo. Agrupan todo lo que necesita una sección de la app para trabajar.
* **Ejemplo:** En `articulos.module.ts`, le decimos: *"Vas a utilizar la Entidad de Base de datos SQL de Artículo, la de Mongo y al camarero y cocinero de artículos"*. ¡Listísimo!

### 2. 📦 Los Archivos `.entity.ts` y `.schema.ts` (El Menú Base)
* **¿Qué hacen?** Definen la "forma" de los platillos. Son la representación exacta en código del diseño de tu base de datos.
* **`.entity.ts`**: Usado para MariaDB (TypeORM). Le dice a la base si un dato es una fecha, un string y con qué otra tabla se relaciona.
* **`.schema.ts`**: Usado para MongoDB (Mongoose). Permite hacer las configuraciones blandas (JSON) sin tantas reglas fuertes.

### 3. 🧠 Los Archivos `.service.ts` (El Cocinero Principal)
* **¿Qué hacen?** ¡Aquí ocurre la magia matemática y de lógica pesada! Es la **lógica del negocio**.
* **La regla dorada:** Si hay que consultar a la base de datos MariaDB para ver si existe un correo, si hay que calcular una sumatoria, cifrar contraseñas, o comunicarse con una IA, **lo hace el servicio**. Nunca se entera de cómo funcionan las peticiones de Internet.

### 4. 🏨 Los Archivos `.controller.ts` (El Mesero del Restaurante)
* **¿Qué hacen?** Son los únicos que interactúan cara a cara con el exterior (ej. Vue o Postman). 
* **La regla dorada:** El Controlador escucha URL's de Internet, toma los datos que subió el usuario, y rápidamente se los avienta al **Servicio** (`.service.ts`) para que trabaje. Cuando el Servicio le devuelve el platillo terminado, el Controlador se lo regresa al cliente en forma de código HTTP (Ejemplo código 201 de Exito o 400 de Error).

---

## 🌐 ¿Qué rayos es un Endpoint?

Para que el Frente de tu página (Frontend) hable con el Servidor (Backend), necesita llamarlo por Internet a través de un **Endpoint**. 
Un Endpoint no es más que una Ruta Web sumada a una Intención (Método HTTP).

**Los 4 métodos básicos de intención que enviamos y recibimos son:**
1. **`GET`**: "Quiero obtener algo." (ej. `GET /articulos/lista` -> Dame todos los artículos)
2. **`POST`**: "Te mando esto nuevo, guárdalo." (ej. `POST /users/registro` -> Toma tu JSON y hazme una cuenta)
3. **`PATCH` o `PUT`**: "Quiero editar o reemplazar esto." (ej. `PATCH /articulos/estado/123` -> Cámbialo de borrador a revisión)
4. **`DELETE`**: "Quiero que borres esto del disco." (ej. `DELETE /asignaciones/123`)

---

## 🛠️ ¿Cómo agrego un nuevo Endpoint si me toca desarrollar uno?

Si en el equipo te tocó la tarea de _"Hacer un endpoint para borrar perfiles"_, estos son los 3 pasos a seguir para no romper la arquitectura:

**Paso 1: Entra al Controlador (`users.controller.ts`)**
(Si tu ruta trata de Usuarios, va en el controlador de usuarios. Lo creas decorando la función con su método HTTP de Nest).

```typescript
import { Controller, Delete, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')  // <-- URL empieza con "misitio.com/users"
export class UsersController {
  constructor(private readonly usersService: UsersService) {} // Enlazaste al cocinero

  // ¡Creamos el endpoint!
  @Delete('perfil/:id') // <-- URL queda como "misitio.com/users/perfil/ALFA-123"
  borrarUnPerfil(@Param('id') userId: string) {
    // ⚠️ EL CONTROLADOR NO BORRA NADA. LE DELEGA EL TRABAJO AL SERVICIO
    return this.usersService.eliminarPerfilTotalmente(userId);
  }
}
```

**Paso 2: Entra al Servicio (`users.service.ts`)**
Abres el servicio y construyes toda la lógica de validación e interacción con MySQL para eliminar el elemento.

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Perfil } from './entities/perfil.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Perfil) // Enlazaste tu base de datos MariaDB
    private perfilDB: Repository<Perfil>,
  ) {}

  // 🔥 AQUÍ SUCEDE EL VERDADERO CÓDIGO 🔥
  async eliminarPerfilTotalmente(userId: string) {
    // Validamos primero que exista en MySQL
    const elemento = await this.perfilDB.findOne({ where: { id: userId } });
    
    if (!elemento) {
      // Regresamos error si no existe
      throw new NotFoundException('¡Oye! Ese perfil ya no existe.'); 
    }
    
    // Lo eliminamos de MariaDB permanentemente
    await this.perfilDB.delete(userId);
    return { mensaje: "Eliminado exitosamente del sistema" };
  }
}
```

**Paso 3: ¡Listo! Conexión Creada**
El Front le lanzará la orden `DELETE` vía Axios o Fetch al Backend a `/users/perfil/TU-ID`. El **Controlador** la cacha en la puerta, extrae el UUID de la URL que mandó front, y se la pasa a la función `eliminarPerfilTotalmente` de nuestro **Servicio**. ¡Esa es toda la ciencia!
