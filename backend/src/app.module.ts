import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ArticulosModule } from './articulos/articulos.module';
import { AsignacionesModule } from './asignaciones/asignaciones.module';
import { AuthModule } from './auth/auth.module';
import { CongresosModule } from './congresos/congresos.module';
import { SolicitudesModule } from './solicitudes/solicitudes.module';
import { SolicitudesCongresoModule } from './solicitudes-congreso/solicitudes-congreso.module';
import { NotificacionesModule } from './notificaciones/notificaciones.module';
import { StaffChatModule } from './staff-chat/staff-chat.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AIModule } from './ai/ai.module';

@Module({
  imports: [
    // MariaDB configuration
    TypeOrmModule.forRoot({
      type: 'mysql',
      url:
        process.env.MARIADB_URI ||
        'mysql://dbuser:dbpassword@localhost:3307/peer_review_db',
      autoLoadEntities: true,
      synchronize: false,
    }),

    // MongoDB configuration
    MongooseModule.forRoot(
      process.env.MONGODB_URI ||
        'mongodb://mongoadmin:mongopassword@localhost:27017/peer_review_nosql?authSource=admin',
    ),

    UsersModule,
    ArticulosModule,
    AsignacionesModule,
    AuthModule,
    CongresosModule,
    SolicitudesModule,
    SolicitudesCongresoModule,
    NotificacionesModule,
    StaffChatModule,
    DashboardModule,
    AIModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
