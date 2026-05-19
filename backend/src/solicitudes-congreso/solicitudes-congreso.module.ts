import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolicitudCongreso } from './entities/solicitud-congreso.entity';
import { Congreso } from '../congresos/entities/congreso.entity';
import { UsuarioCongresoRol } from '../congresos/entities/usuario-congreso-rol.entity';
import { User } from '../users/entities/user.entity';
import { Tag } from '../congresos/entities/tag.entity';
import { SolicitudesCongresoService } from './solicitudes-congreso.service';
import { SolicitudesCongresoController } from './solicitudes-congreso.controller';
import { NotificacionesModule } from '../notificaciones/notificaciones.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SolicitudCongreso,
      Congreso,
      UsuarioCongresoRol,
      User,
      Tag,
    ]),
    NotificacionesModule,
  ],
  providers: [SolicitudesCongresoService],
  controllers: [SolicitudesCongresoController],
  exports: [SolicitudesCongresoService],
})
export class SolicitudesCongresoModule {}
