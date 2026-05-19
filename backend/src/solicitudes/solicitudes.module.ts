import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolicitudRol } from './entities/solicitud-rol.entity';
import { SolicitudesService } from './solicitudes.service';
import { SolicitudesController } from './solicitudes.controller';
import { UsuarioCongresoRol } from '../congresos/entities/usuario-congreso-rol.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SolicitudRol, UsuarioCongresoRol]),
  ],
  providers: [SolicitudesService],
  controllers: [SolicitudesController],
  exports: [SolicitudesService],
})
export class SolicitudesModule {}
