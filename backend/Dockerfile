FROM node:20-alpine

# Directorio de trabajo en el contenedor
WORKDIR /app

# Copiamos archivos de dependencias
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto de la API
EXPOSE 3000

# Comando para iniciar la aplicación en desarrollo
CMD ["npm", "run", "start:dev"]
