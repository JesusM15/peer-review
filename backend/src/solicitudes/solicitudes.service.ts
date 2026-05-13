import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { SolicitudRol, EstadoSolicitud } from './entities/solicitud-rol.entity';
import { UsuarioCongresoRol } from '../congresos/entities/usuario-congreso-rol.entity';
import { v4 as uuidv4 } from 'uuid';
import { Rol } from '../users/entities/user.entity';

@Injectable()
export class SolicitudesService {
  constructor(
    @InjectRepository(SolicitudRol)
    private readonly solicitudRepository: Repository<SolicitudRol>,
    @InjectRepository(UsuarioCongresoRol)
    private readonly membershipRepository: Repository<UsuarioCongresoRol>,
  ) { }

  async create(data: { user_id: string; congreso_id: string; rol_solicitado: Rol; motivo?: string }) {
    // 1. Verificar si ya tiene una solicitud pendiente en este congreso
    const pendiente = await this.solicitudRepository.findOne({
      where: {
        user_id: data.user_id,
        congreso_id: data.congreso_id,
        estado: EstadoSolicitud.PENDIENTE,
      },
    });

    if (pendiente) {
      throw new ConflictException('Ya tienes una solicitud pendiente para este congreso.');
    }

    // 2. Verificar COOLDOWN: No puede solicitar si fue rechazado hace menos de 1 hora
    const unaHoraAtras = new Date(Date.now() - 60 * 60 * 1000);
    const rechazadoRecientemente = await this.solicitudRepository.findOne({
      where: {
        user_id: data.user_id,
        congreso_id: data.congreso_id,
        estado: EstadoSolicitud.RECHAZADO,
        fecha_resolucion: MoreThan(unaHoraAtras),
      },
    });

    if (rechazadoRecientemente && rechazadoRecientemente.fecha_resolucion) {
      const diff = Math.ceil((rechazadoRecientemente.fecha_resolucion.getTime() + 60 * 60 * 1000 - Date.now()) / (60 * 1000));
      throw new BadRequestException(`Debes esperar ${diff} minutos más para volver a postularte tras un rechazo.`);
    }

    // 3. Crear la solicitud
    const nuevaSolicitud = this.solicitudRepository.create({
      id: uuidv4(),
      user_id: data.user_id,
      congreso_id: data.congreso_id,
      rol_solicitado: data.rol_solicitado,
      motivo_usuario: data.motivo,
      estado: EstadoSolicitud.PENDIENTE,
    });

    return this.solicitudRepository.save(nuevaSolicitud);
  }

  async findAllByCongreso(congreso_id: string) {
    return this.solicitudRepository.find({
      where: { congreso_id },
      relations: ['user'],
      order: { fecha_creacion: 'DESC' },
    });
  }

  async findByUser(user_id: string) {
    return this.solicitudRepository.find({
      where: { user_id },
      relations: ['congreso'],
      order: { fecha_creacion: 'DESC' },
    });
  }

  async resolve(id: string, data: { estado: EstadoSolicitud; respuesta?: string }) {
    const solicitud = await this.solicitudRepository.findOne({
      where: { id },
      relations: ['user', 'congreso']
    });

    if (!solicitud) {
      throw new NotFoundException('Solicitud no encontrada.');
    }

    if (solicitud.estado !== EstadoSolicitud.PENDIENTE) {
      throw new BadRequestException('Esta solicitud ya ha sido procesada.');
    }

    solicitud.estado = data.estado;
    solicitud.respuesta_admin = data.respuesta;
    solicitud.fecha_resolucion = new Date();

    if (data.estado === EstadoSolicitud.APROBADO) {
      // ACTUALIZAR ROL EN EL CONGRESO
      let membership = await this.membershipRepository.findOne({
        where: { user_id: solicitud.user_id, congreso_id: solicitud.congreso_id }
      });

      if (membership) {
        membership.rol = solicitud.rol_solicitado;
      } else {
        membership = this.membershipRepository.create({
          id: uuidv4(),
          user_id: solicitud.user_id,
          congreso_id: solicitud.congreso_id,
          rol: solicitud.rol_solicitado
        });
      }
      await this.membershipRepository.save(membership);
    }

    return this.solicitudRepository.save(solicitud);
  }
}
