# 🛠️ Instrucciones de Solución: Docker + Base de Datos

> 📌 **Este documento es también un PROMPT listo para pasarle a una IA** (ChatGPT, Gemini, Antigravity, etc.) si tienes problemas con Docker o la conexión a la base de datos. Copia la sección marcada y pégala directo en el chat.

---

## ⚡ Solución Rápida (Ya sé lo que hago)

Si acabas de hacer `git pull` y Docker no conecta, corre esto en orden:

```bash
# 1. Pararte en la raíz del proyecto
cd proyecto_final

# 2. Crear tu .env local desde la plantilla correcta (SI NO TIENES .env)
copy backend\.env.example backend\.env

# 3. Bajar y volver a levantar Docker con build fresco
docker compose down
docker compose up -d --build

# 4. (Solo la primera vez o si alguien agregó paquetes nuevos)
docker exec -it peer_review_api npm install

# 5. (Opcional) Cargar datos de prueba
docker exec peer_review_api npx ts-node src/database/seed.ts
```

✅ La API estará en: `http://localhost:3000`  
✅ MariaDB accesible desde tu PC en: `localhost:3307`  
✅ MongoDB Compass en: `mongodb://mongoadmin:mongopassword@localhost:27017/peer_review_nosql?authSource=admin`

---

## 🧠 ¿Por Qué Fallaba? (El diagnóstico completo)

Se encontraron **3 bugs críticos** de configuración que causaban que cada compañero tuviera errores diferentes:

### Bug 1 — `.env` con `localhost` en lugar de nombres de servicio Docker

El archivo `.env` del backend tenía esto (incorrecto):
```env
MARIADB_URI=mysql://dbuser:dbpassword@localhost:3307/peer_review_db
```
Y debería tener esto (correcto):
```env
MARIADB_URI=mysql://dbuser:dbpassword@mariadb:3306/peer_review_db
```

**¿Por qué?** La app NestJS corre **dentro** del contenedor Docker. Dentro de Docker, `localhost` apunta al propio contenedor de la API, no a MariaDB. Los contenedores se comunican entre sí por el **nombre del servicio** definido en `docker-compose.yml` (que es `mariadb`, `mongodb`, `redis`) y por el **puerto interno** (3306, no 3307).

```
Desde TU PC:         localhost:3307 → MariaDB  ✅ (puerto externo mapeado)
Desde el contenedor: localhost:3307 → NADIE    ❌ (apunta a sí mismo)
Desde el contenedor: mariadb:3306  → MariaDB  ✅ (red interna Docker)
```

### Bug 2 — `.env` estaba en git (sin `.gitignore`)

El archivo `.env` **no estaba** en el `.gitignore` del backend. Esto causaba:
- Cada `git push` subía el `.env` de esa persona a GitHub
- Cada `git pull` sobreescribía el `.env` de los demás
- **Por eso todos tenían valores diferentes**

Se corrigió agregando `.env` al `backend/.gitignore` y desregistrando el archivo del historial de git con `git rm --cached backend/.env`.

### Bug 3 — La API arrancaba antes de que MariaDB estuviera lista

El `docker-compose.yml` tenía `depends_on: mariadb` pero eso solo espera a que el **contenedor exista**, no a que MariaDB **termine de inicializar** internamente (lo cual tarda ~10 segundos la primera vez). Esto causaba el error `ECONNREFUSED` al primer `docker compose up`.

Se corrigió agregando un `healthcheck` a MariaDB y cambiando el `depends_on` a `condition: service_healthy`.

---

## ✅ Estado Final de los Archivos Corregidos

### `backend/.env` (correcto, para Docker)
```env
# Server
PORT=3000

# MariaDB - usar nombre del servicio Docker, NO localhost
MARIADB_URI=mysql://dbuser:dbpassword@mariadb:3306/peer_review_db

# MongoDB - usar nombre del servicio Docker, NO localhost
MONGODB_URI=mongodb://mongoadmin:mongopassword@mongodb:27017/peer_review_nosql?authSource=admin

# Redis - usar nombre del servicio Docker, NO localhost
REDIS_URI=redis://redis:6379
```

### `backend/.gitignore` (nuevo: incluye `.env`)
```
node_modules
dist
.env        ← NUEVO: evita que se suba a git
dist-ssr
*.local
...
```

### `docker-compose.yml` (nuevo: healthcheck + restart)
```yaml
api:
  depends_on:
    mariadb:
      condition: service_healthy   # ← espera que MariaDB esté lista
    mongodb:
      condition: service_started
    redis:
      condition: service_started
  restart: unless-stopped          # ← se reinicia si crashea

mariadb:
  healthcheck:
    test: ["CMD", "healthcheck.sh", "--connect", "--innodb_initialized"]
    start_period: 10s
    interval: 10s
    timeout: 5s
    retries: 5
```

---

## 🤖 PROMPT PARA IA — Pégalo si tienes problemas

> Copia todo el texto de abajo y pégaselo a la IA de tu preferencia si Docker no funciona o la base de datos no conecta:

---

```
Hola, tengo un proyecto universitario llamado "Peer Review System" con la siguiente arquitectura:
- Backend: NestJS (TypeScript) corriendo en Docker, contenedor llamado "peer_review_api" en puerto 3000
- Base de datos relacional: MariaDB 10.11 en Docker, contenedor "peer_review_mariadb", puerto externo 3307 → interno 3306
- Base de datos NoSQL: MongoDB 6.0 en Docker, contenedor "peer_review_mongodb", puerto 27017
- Caché: Redis 7.0 en Docker, contenedor "peer_review_redis", puerto 6379
- Frontend: Vue 3 + Vite corriendo fuera de Docker en puerto 5173

El proyecto usa docker-compose.yml en la raíz, y el backend tiene su .env en backend/.env.
La app usa TypeORM con synchronize:true para crear tablas automáticamente al arrancar NestJS.
El .env correcto para Docker usa nombres de servicio (mariadb, mongodb, redis) y puertos internos:
- MARIADB_URI=mysql://dbuser:dbpassword@mariadb:3306/peer_review_db
- MONGODB_URI=mongodb://mongoadmin:mongopassword@mongodb:27017/peer_review_nosql?authSource=admin
- REDIS_URI=redis://redis:6379

Tengo el siguiente error: [PEGA AQUÍ TU ERROR]

Por favor diagnostica qué está mal y dame los comandos exactos para arreglarlo.
Toma en cuenta:
1. Si el error dice "ECONNREFUSED localhost:330X" → el .env tiene localhost en lugar del nombre de servicio Docker
2. Si el error dice "Cannot find module" → falta correr: docker exec -it peer_review_api npm install
3. Si el error dice "ENOTFOUND mariadb" → el script se está ejecutando fuera de Docker (usa docker exec para correrlo dentro)
4. Si el error dice "Duplicate entry for key PRIMARY" → la tabla ya tiene datos con values vacíos, necesitas limpiar la tabla primero
```

---

## 📋 Comandos de Diagnóstico Útiles

```bash
# Ver si todos los contenedores están corriendo (mariadb debe decir "healthy")
docker ps

# Ver los logs en tiempo real de la API (para ver si arrancó bien)
docker logs -f peer_review_api

# Ver qué valor tiene MARIADB_URI dentro del contenedor (debe decir @mariadb:3306)
docker exec peer_review_api printenv MARIADB_URI

# Ver si las tablas se crearon en MariaDB
docker exec peer_review_mariadb mysql -udbuser -pdbpassword peer_review_db -e "SHOW TABLES;"

# Entrar a MariaDB manualmente
docker exec -it peer_review_mariadb mariadb -u dbuser -p
# (contraseña: dbpassword)
```
