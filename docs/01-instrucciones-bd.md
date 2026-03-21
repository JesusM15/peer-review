# 🗄️ Guía de Bases de Datos: MariaDB & MongoDB

## 🚀 ¿Cómo inicializar las Bases de Datos?
Dado que nuestro sistema requiere múltiples bases de datos, la forma más estandarizada y fácil para el equipo es utilizar **Docker Compose**. Docker descarga y corre virtualmente los motores de base de datos en el fondo.

1. Asegúrate de tener **Docker Desktop** instalado y abierto en tu computadora.
2. Abre la terminal en la raíz de tu proyecto (donde generalmente tengas el archivo `docker-compose.yml`).
3. Ejecuta el comando mágico:
   ```bash
   docker-compose up -d
   ```
4. **¡Es todo!** Las bases de datos MariaDB, MongoDB y el caché (Redis) se prenderán solos 🪄. 

> *Nota rápida:* Nuestra arquitectura usa TypeORM (`synchronize: true`). Esto significa que con el simple hecho de arrancar el servidor backend en código (`npm run start:dev` en la carpeta `backend/`), él mismo analizará nuestro código y **creará todas las tablas en MariaDB de manera automática**. ¡No necesitan usar consultas SQL para construirlas!

---

## 🧠 Estructura "Doble" (Offline-First)

Como la red puede fallar y el sistema está pensado para PWA (Offline-First), los identificadores (`id`) de los datos **los genera el cliente/teléfono** mediante un string de código único llamado **UUID v4**. 

Usamos dos bases de datos en sincronía gracias a esto:
* **MariaDB (Estructurado):** Guarda las cosas clave (logins, estatus, nombres).
* **MongoDB (Flexible):** Guarda lo pesadisímo y dinámico (arreglos numéricos grandes de la IA, párrafos PDF).
* **El Enlace Seguro:** Se enlazan sin necesidad de reglas estrictas. Si creamos un Artículo con UUID `ABC` en MariaDB, vamos a MongoDB y creamos los detalles de ese artículo poniéndole exactamente `ABC` como su identificador principal (`_id`).

---

## 🏗️ Diccionario de Tablas y Relaciones Creadas

### 1. MariaDB (Lo que verás en `.entity.ts`)
* **👤 `User` (Usuario Principal):** 
  * Es el centro del sistema. Guarda su `id` principal (UUID), un `email` único, su `password` y su `rol` (Autor, Revisor, o Editor).
* **🪪 `Perfil` (Datos de Usuario):** 
  * Se enlaza en una relación **1 a 1** con el Usuario. 
  * *Abstracción:* Para hacer fácil la consulta, ¡el ID del perfil es el mismísimo ID del usuario! Guarda el `nombre`, `carrera` y un arreglo básico de `especialidades`.
* **📄 `Articulo` (Punto central de publicación):**
  * Se enlaza en relación **N a 1** con un Autor (`User`). Muchos artículos pueden ser de un solo autor. 
  * Guarda el `titulo`, el `estado` (ej. Borrador, Aceptado), y el ID de su autor foráneo.
* **🤝 `Asignacion` (El Trabajo Asignado):** 
  * Es un pivote/puente. Une un **Artículo específico** con un **Revisor específico**.
  * Además de saber a quién va dirigido, guarda por sí mismo una `fecha_limite`.

### 2. MongoDB (Lo que verás en `.schema.ts`)
* **🔬 `ArticuloDetalle`:**
  * Su nombre lo dice: acompaña al `Articulo`. 
  * Usa el id del artículo en MariaDB para unirse. Guarda `pdf_url` (ruta del archivo), `keywords` (etiquetas), y los `embeddings` (la codificación matemática de IA).
* **📝 `Revision`:**
  * Acompaña a la `Asignacion`. 
  * Guarda datos cuyo tamaño puede variar muchísimo. Por ejemplo, `secciones` (la lista entera de retroalimentaciones hechas en áreas específicas del PDF) y el `analisis_ia` (opiniones de comportamiento arrojadas por la Inteligencia Artificial). Como esto cambia todo el tiempo, guardarlo aquí en Mongo (como JSON abierto) es vital para evitar errores de columnas de SQL.
