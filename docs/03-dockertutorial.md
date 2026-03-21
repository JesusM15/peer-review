# 🐳 Tutorial Súper Rápido de Docker (Cheat-Sheet)

¡Hola equipo! Si nunca en su vida habían usado Docker, no se preocupen, está diseñado para hacernos la vida más fácil, no más difícil.

**Explicación en 3 renglones:** 
En lugar de que cada uno de ustedes instale MariaDB, MongoDB y el caché en sus computadoras (y estar peleando porque a Pedrito le falló por su Windows, y a Anita le dice "Puerto 3306 ocupado"...), usamos "Cajas con todo incluido" que corren solas. Docker aísla estas cajas, las prende cuando ustedes quieren trabajar, y nuestra computadora principal nunca se contamina de instalaciones molestas. 📦✨

---

## 🏎️ 1. Comandos de Supervivencia Básica

Estos comandos se corren en la carpeta de nuestro proyecto (donde esté el archivo `docker-compose.yml`):

* **Prender todo:** `docker-compose up -d`
*(El "-d" sirve para que se ejecute en reversa/silencio y te devuelvan el control de tu consola).*
* **Ver si las cajas están prendidas:** `docker ps`
*(Saldrá una listita que dirá "peer_review_mariadb", etc).*
* **Apagar el proyecto para irse a dormir:** `docker-compose down`
* **Leer los errores (Logs) de una caja:** `docker logs nombre_del_contenedor` *(Ejemplo para ver si nuestro backend chocó: `docker logs peer_review_api`).*

---

## 🐬 2. ¿Cómo entrar a MariaDB a tirar sentencias SQL manuales?

A veces ocupamos asomarnos para ver si se guardó el "Artículo", o si las relaciones se crearon. Para meternos a la base de datos desde la consola:

1. Abre tu terminal (Powershell o CMD).
2. Tira el comando para entrar a esa "caja" y simular un log-in en mariadb:
   ```bash
   docker exec -it peer_review_mariadb mariadb -u dbuser -p
   ```
3. Se va a detener un segundo, es porque pide **Password**. Escribe la nuestra: `dbpassword`. *(Al teclear no vas a ver asteriscos ni nada por seguridad, tú sólo escríbela y presiona ENTER).*
4. ¡Bingo! Tu terminal va a cambiar a `MariaDB [(none)]>`.
5. Tira comandos clásicos y no olvides el Punto-y-Coma de SQL:
   * `USE peer_review_db;`
   * `SHOW TABLES;`
   * `SELECT * FROM users;`
6. ¿Para salir de ahí? Simplemente escribe `exit` y presiona ENTER.

---

## 🍃 3. ¿Cómo conecto un programa bonito para revisar MongoDB?

Como MongoDB está lleno de JSONs enrevesados, nadie en su sano juicio lo lee en la pantallita negra. Se recomienda que todos instalen el programa oficial gratuito llamado **MongoDB Compass**.

¿Cómo se conectan?
1. Abren MongoDB Compass.
2. En la barra largota del medio que dice "Add new Connection" (Añadir nueva conexión), en lugar de rellenar formulario, **pega exactamente esta cadena**:
   ```text
   mongodb://mongoadmin:mongopassword@localhost:27017/peer_review_nosql?authSource=admin
   ```
3. Le das a **Connect** y ¡listo! A la izquierda vas a ver un Foldercito llamado `peer_review_nosql` con nuestras colecciones adentro y todo el poder de darle clic, editar, y borrar cosas con el mouse.

---

## 💻 4. ¿Cómo me meto directamente al Backend o a otra caja a instalar cosas?

Imagina que uno de los contenedores (las cajas) es una mini-computadora, a veces necesitamos acceder para ver qué archivos hay dentro (por ejemplo al backend de NestJS).

1. Tirando este comando te metes usando Shell (`sh`):
   ```bash
   docker exec -it peer_review_api sh
   ```
   *(Si ves que otro contenedor rechaza `sh`, siempre intenta con `bash`).*
2. Tu terminal se convertirá a un `/app #` indicando que estás adentro.
3. Ya puedes correr cosas como investigar listas: `ls` o correr paquetes: `npm install`.
4. Escribes `exit` y devuelta a tu computadora real.
