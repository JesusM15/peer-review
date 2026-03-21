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
      url: process.env.MARIADB_URI || 'mysql://dbuser:dbpassword@mariadb:3306/peer_review_db',
      autoLoadEntities: true,
      synchronize: true, // ¡La magia! Crea las tablas automáticamente
    }),
    
    // Configuración de MongoDB a través de Mongoose
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://mongoadmin:mongopassword@mongodb:27017/peer_review_nosql?authSource=admin'
    ),
    
    UsersModule,
    ArticulosModule,
    AsignacionesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
