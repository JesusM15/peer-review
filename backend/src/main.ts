import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Todo el backend responderá mediante /api/ (ej. /api/ping)
  app.setGlobalPrefix('api');

  // Configuración de CORS permitiendo el frontend en Vite (localhost:5173)
  app.enableCors({
    origin: ['http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Escuchar en todas las interfaces (0.0.0.0) para que el contenedor de Docker exponga el puerto
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
