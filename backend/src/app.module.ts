import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ArticulosModule } from './articulos/articulos.module';
import { AsignacionesModule } from './asignaciones/asignaciones.module';

@Module({
  imports: [
    // Configuración de MariaDB a través de TypeORM
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3307, // el docker-compose expone el 3307 hacia afuera
      username: process.env.DB_USER || 'dbuser',
      password: process.env.DB_PASSWORD || 'dbpassword',
      database: process.env.DB_NAME || 'peer_review_db',
      autoLoadEntities: true,
      synchronize: true, // ¡La magia! Crea las tablas automáticamente
    }),
    
    // Configuración de MongoDB a través de Mongoose
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://mongoadmin:mongopassword@localhost:27017/peer_review_nosql?authSource=admin'
    ),
    
    UsersModule,
    ArticulosModule,
    AsignacionesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
