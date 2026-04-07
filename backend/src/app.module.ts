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
    // MariaDB configuration
    TypeOrmModule.forRoot({
      type: 'mysql',
      url: process.env.MARIADB_URI || 'mysql://dbuser:dbpassword@localhost:3307/peer_review_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    
    // MongoDB configuration
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://mongoadmin:mongopassword@localhost:27017/peer_review_nosql?authSource=admin'),
    
    UsersModule,
    ArticulosModule,
    AsignacionesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
