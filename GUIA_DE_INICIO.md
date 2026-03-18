# 🚀 Guía de Inicio - Peer Review System (PWA)

Bienvenido al proyecto **Peer Review System**. Esta aplicación está construida con **NestJS** en el backend (API) y **Vue 3 + Vite** para el frontend (PWA Offline-First), utilizando infraestructura respaldada por **Docker** (MariaDB, MongoDB y Redis).

A continuación se detallan los pasos necesarios para levantar el entorno de desarrollo.

---

## 🐳 Conceptos Rápidos: ¿Qué es Docker y por qué lo usamos?

Para no sufrir instalando MariaDB, MongoDB o Servidores manualmente en cada computadora, utilizamos **Docker**: una tecnología que empaqueta tu backend y bases de datos en "cajitas cerradas" (contenedores) que ya traen todo. Gracias a ello, **con un solo comando** y sin importar si tu equipo usa Windows o Mac, todos levantan el mismo entorno al instante y evitan el temido problema *"en mi máquina sí funciona"*.

Además usamos **Volúmenes**. Dado que un contenedor es perecedero (si lo borras, adiós base de datos), el Volumen funciona como un "USB virtual". Guarda la vital información de la base de datos *por fuera* del contenedor; si lo apagas, ¡tu datos siguen a salvo!

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalados:

1. [Node.js](https://nodejs.org/) (versión recomendada 20.x+)
2. [Docker Desktop](https://www.docker.com/products/docker-desktop) o Docker Engine (asegúrate de que el demonio de Docker esté activo)
3. Git

---

## ⚙️ 1. Configuración de Variables de Entorno

Antes de levantar los contenedores, asegúrate de configurar el entorno del backend:

1. Ve a la carpeta `backend/`.
2. Si no existe un archivo `.env`, copia el archivo `.env.example`:
   ```bash
   cp backend/.env.example backend/.env
   ```
3. Verifica que las credenciales de base de datos coincidan con las del `docker-compose.yml`.

---

## 🐳 2. Iniciar el Backend e Infraestructura (Docker)

Todo el ambiente del backend (API de NestJS, MariaDB, MongoDB y Redis) está empaquetado y orquestado a través de Docker Compose.

1. Abre tu terminal en la raíz del proyecto (`proyecto_final/`).
2. Ejecuta el siguiente comando para construir e iniciar los contenedores en segundo plano:
   ```bash
   docker-compose up -d --build
   ```
3. **Verificar que todo funciona:**
   - La API de NestJS estará disponible en: `http://localhost:3000`
   - Si revisas Docker Desktop, deberías ver 4 contenedores corriendo: `peer_review_api`, `peer_review_mariadb`, `peer_review_mongodb` y `peer_review_redis`.
   - Para ver los logs en tiempo real del backend, puedes usar:
     ```bash
     docker logs -f peer_review_api
     ```

*(Nota: En el primer inicio, las bases de datos pueden tardar unos segundos en estar listas para recibir conexiones).*

---

## 🌐 3. Iniciar el Frontend (Vue 3 / PWA)

El Frontend está desarrollado con **Vue 3**, **Vite** y plugins específicos para características de Progressive Web App (PWA) como **VitePWA**.

1. Abre otra ventana en tu terminal y navega al directorio del frontend:
   ```bash
   cd frontend/
   ```
2. Instala las dependencias necesarias de Node.js (solo es necesario hacerlo la primera vez o si cambias algo en `package.json`):
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo de Vite:
   ```bash
   npm run dev
   ```
4. **Verificar que el Frontend funciona:**
   - Deberías poder acceder mediante tu navegador web en: `http://localhost:5173/` (el puerto estándar de Vite).
   - *Nota: Gracias a proxying configurado en `vite.config.ts`, las peticiones a `/api` hechas desde el frontend automáticamente se enviarán a `http://localhost:3000`.*

---

## 🛠 Comandos Útiles en el Día a Día

### Detener los contenedores (sin borrar datos)
```bash
docker-compose stop
```

### Detener y borrar contenedores (mantiene la data guardada en volúmenes Docker)
```bash
docker-compose down
```

### Limpiar infraestructura por completo (⚠️ Borra volúmenes / bases de datos)
```bash
docker-compose down -v
```

### Instalar una nueva dependencia en el frontend
```bash
cd frontend
npm install nombre_del_paquete
```

### Ver el estado de los contenedores
```bash
docker ps
```
