# 📦 Guía de Instalación de Paquetes (`npm install`) trabajando con Docker

¿Qué pasa si descargas la última versión del proyecto de Github y un compañero dice: *"¡Oigan! Ya metí un paquete nuevo para imprimir PDFs en la API"*? 

Si tú descargas esos cambios (`git pull`), inicias tu Docker y... **¡BUM!** 💥 El backend se va a la basura y se la pasa reiniciándose marcando un error rojo gigante que dice: `"Cannot find module 'herramienta-nueva'"`.

---

## 🤔 ¿Por qué ocurre esto y por qué NO basta un `npm i` normal?

Porque en nuestra configuración moderna, **Docker tiene su propia carpeta sellada herméticamente para las instalaciones de la API** (él guarda sus dependencias en un lugar que se llama `Volume /app/node_modules`). Esta bóveda es **totalmente independiente** de la carpeta `node_modules` que tú físicamente ves allí tirada en tu Windows o Mac.

Aunque abras la carpeta `backend/` y corras un desesperado `npm install` en tu computadora, el cerebro de Docker NO se va a enterar y seguirá chocando.

---

## 🛠️ ¿Cúando debo correr las instalaciones?

Única y sencillamente en estos **2 casos excepcionales**:
1. **El primerísimo día**, cuando clonas apenas el repositorio de GitHub y vas a arrancar el sistema por tu primera vez.
2. Tras hacer un `git pull`, **SÍ** notas que hubieron modificaciones en el archivo `package.json` del backend (eso es chivatazo de que alguien añadió una herramienta externa nueva).

---

## 🚀 La Solución: Los Comandos Definitivos

Para salir de este lío rápido, jamás debes apagar o borrar nada. Lo que haremos será "Tocarle a la puerta interna de la API" y ordenarle que instale las cosas adentro de su propia bóveda:

### 1. Instrucción para actualizar el servidor Backend (Nest)
Abre tu consola súper normal (powershell o cmd) y lanza esta joya estando tus contenedores prendidos:
```bash
docker exec -it peer_review_api npm install
```
> **¿Qué hace?** `docker exec` entra en línea directa al contenedor de nombre `peer_review_api` y le regala la orden mágica `npm install`. Verás que carga la barrita y al segundo tu aplicación revivirá automáticamente sola.

### 2. Instrucción para agregar nuevas cosas si tú eres el desarrollador
Si hoy te tocó codificar a ti y descubriste un paquete padrísimo en internet digamos para encriptar cosas (ej. `npm install bcrypt`), para instalarlo permanentemente dentro del servidor y que el código no falle no lo tires en Windows, tíralo en Docker:
```bash
docker exec -it peer_review_api npm install bcrypt
```

### 3. Instrucción para actualizar el Frontend (Vue/Vite)
Como recordarás, el diseño web Vue vive por fuera flotando maravillosamente lejos de los enredos de Docker, por tanto este sí es un simple y mundano *Npm install* clásico:
```bash
cd frontend
npm install
```

¡Guarda estas reglas como oro puro que les ahorrarán 4 horas de peleas contra el "fantasma" de los archivos borrados en discordia computacional!
