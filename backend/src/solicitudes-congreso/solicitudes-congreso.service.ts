import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  SolicitudCongreso,
  EstadoSolicitudCongreso,
} from './entities/solicitud-congreso.entity';
import { Congreso } from '../congresos/entities/congreso.entity';
import { Tag } from '../congresos/entities/tag.entity';
import { UsuarioCongresoRol } from '../congresos/entities/usuario-congreso-rol.entity';
import { User, Rol } from '../users/entities/user.entity';
import { CreateSolicitudCongresoDto } from './dto/create-solicitud-congreso.dto';
import { ResolveSolicitudCongresoDto } from './dto/resolve-solicitud-congreso.dto';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { TipoNotificacion } from '../notificaciones/entities/notificacion.entity';

@Injectable()
export class SolicitudesCongresoService {
  constructor(
    @InjectRepository(SolicitudCongreso)
    private readonly solicitudRepo: Repository<SolicitudCongreso>,
    @InjectRepository(Congreso)
    private readonly congresoRepo: Repository<Congreso>,
    @InjectRepository(UsuarioCongresoRol)
    private readonly ucrRepo: Repository<UsuarioCongresoRol>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
    private readonly notificacionesService: NotificacionesService,
  ) {}

  async create(
    solicitanteId: string,
    data: CreateSolicitudCongresoDto,
  ): Promise<SolicitudCongreso> {
    const solicitante = await this.userRepo.findOne({
      where: { id: solicitanteId },
    });
    if (!solicitante) {
      throw new NotFoundException('Usuario solicitante no encontrado.');
    }

    const pendienteMismoNombre = await this.solicitudRepo.findOne({
      where: {
        solicitante_id: solicitanteId,
        nombre_propuesto: data.nombre_propuesto,
        estado: EstadoSolicitudCongreso.PENDIENTE,
      },
    });

    if (pendienteMismoNombre) {
      throw new ConflictException(
        'Ya tienes una solicitud pendiente con ese nombre propuesto.',
      );
    }

    if (data.fecha_inicio_propuesta && data.fecha_fin_propuesta) {
      const inicio = new Date(data.fecha_inicio_propuesta);
      const fin = new Date(data.fecha_fin_propuesta);
      if (fin < inicio) {
        throw new BadRequestException(
          'La fecha de fin no puede ser anterior a la de inicio.',
        );
      }
    }
    if (this.normalizeTags(data.tags).length === 0) {
      throw new BadRequestException('Cada congreso debe tener al menos una etiqueta.');
    }

    const solicitud = this.solicitudRepo.create({
      id: uuidv4(),
      solicitante_id: solicitanteId,
      nombre_propuesto: data.nombre_propuesto.trim(),
      descripcion_propuesta: data.descripcion_propuesta?.trim(),
      fecha_inicio_propuesta: data.fecha_inicio_propuesta
        ? new Date(data.fecha_inicio_propuesta)
        : undefined,
      fecha_fin_propuesta: data.fecha_fin_propuesta
        ? new Date(data.fecha_fin_propuesta)
        : undefined,
      motivo: data.motivo?.trim(),
      tags: this.normalizeTags(data.tags),
      estado: EstadoSolicitudCongreso.PENDIENTE,
    });

    const guardada = await this.solicitudRepo.save(solicitud);

    await this.notificacionesService.notificarAdmins({
      tipo: TipoNotificacion.SOLICITUD_CONGRESO_NUEVA,
      titulo: 'Nueva solicitud de congreso',
      mensaje: `${solicitante.nombre} solicita crear el congreso "${guardada.nombre_propuesto}".`,
      link: '/admin?tab=solicitudes-congreso',
    });

    return guardada;
  }

  async findAll(): Promise<SolicitudCongreso[]> {
    return this.solicitudRepo.find({
      relations: ['solicitante'],
      order: { fecha_creacion: 'DESC' },
    });
  }

  async findPendientes(): Promise<SolicitudCongreso[]> {
    return this.solicitudRepo.find({
      where: { estado: EstadoSolicitudCongreso.PENDIENTE },
      relations: ['solicitante'],
      order: { fecha_creacion: 'ASC' },
    });
  }

  async findByUser(user_id: string): Promise<SolicitudCongreso[]> {
    return this.solicitudRepo.find({
      where: { solicitante_id: user_id },
      order: { fecha_creacion: 'DESC' },
    });
  }

  async findOne(
    id: string,
    requestingUser: { id: string; rol: Rol },
  ): Promise<SolicitudCongreso> {
    const solicitud = await this.solicitudRepo.findOne({
      where: { id },
      relations: ['solicitante'],
    });
    if (!solicitud) throw new NotFoundException('Solicitud no encontrada.');

    if (
      requestingUser.rol !== Rol.ADMIN &&
      solicitud.solicitante_id !== requestingUser.id
    ) {
      throw new ForbiddenException(
        'No puedes consultar solicitudes de otros usuarios.',
      );
    }

    return solicitud;
  }

  async resolve(
    id: string,
    adminId: string,
    data: ResolveSolicitudCongresoDto,
  ): Promise<SolicitudCongreso> {
    const admin = await this.userRepo.findOne({ where: { id: adminId } });
    if (!admin || admin.rol !== Rol.ADMIN) {
      throw new ForbiddenException(
        'Solo el administrador puede resolver solicitudes.',
      );
    }

    if (
      data.estado !== EstadoSolicitudCongreso.APROBADO &&
      data.estado !== EstadoSolicitudCongreso.RECHAZADO
    ) {
      throw new BadRequestException(
        'Estado inválido. Debe ser Aprobado o Rechazado.',
      );
    }

    const solicitud = await this.solicitudRepo.findOne({
      where: { id },
      relations: ['solicitante'],
    });
    if (!solicitud) throw new NotFoundException('Solicitud no encontrada.');

    if (solicitud.estado !== EstadoSolicitudCongreso.PENDIENTE) {
      throw new BadRequestException('Esta solicitud ya fue procesada.');
    }

    solicitud.estado = data.estado;
    solicitud.respuesta_admin = data.respuesta;
    solicitud.fecha_resolucion = new Date();

    if (data.estado === EstadoSolicitudCongreso.APROBADO) {
      const congreso = this.congresoRepo.create({
        id: uuidv4(),
        nombre: solicitud.nombre_propuesto,
        descripcion: solicitud.descripcion_propuesta,
        fecha_inicio: solicitud.fecha_inicio_propuesta,
        fecha_fin: solicitud.fecha_fin_propuesta,
      });
      const congresoCreado = await this.congresoRepo.save(congreso);

      for (const tagName of this.normalizeTags(solicitud.tags)) {
        await this.tagRepo.save(this.tagRepo.create({
          id: uuidv4(),
          nombre: tagName,
          congreso_id: congresoCreado.id,
        }));
      }

      const membresia = this.ucrRepo.create({
        id: uuidv4(),
        user_id: solicitud.solicitante_id,
        congreso_id: congresoCreado.id,
        rol: Rol.EDITOR_JEFE,
      });
      await this.ucrRepo.save(membresia);

      solicitud.congreso_creado_id = congresoCreado.id;
    }

    const guardada = await this.solicitudRepo.save(solicitud);

    if (data.estado === EstadoSolicitudCongreso.APROBADO) {
      await this.notificacionesService.crear({
        user_id: solicitud.solicitante_id,
        tipo: TipoNotificacion.SOLICITUD_CONGRESO_APROBADA,
        titulo: 'Tu congreso fue aprobado',
        mensaje:
          `El congreso "${solicitud.nombre_propuesto}" fue aprobado. ` +
          'Has sido asignado como Editor en Jefe automáticamente.',
        link: '/select-congress',
      });
    } else {
      await this.notificacionesService.crear({
        user_id: solicitud.solicitante_id,
        tipo: TipoNotificacion.SOLICITUD_CONGRESO_RECHAZADA,
        titulo: 'Tu solicitud de congreso fue rechazada',
        mensaje:
          `La propuesta "${solicitud.nombre_propuesto}" fue rechazada.` +
          (data.respuesta ? ` Motivo del admin: ${data.respuesta}` : ''),
        link: '/solicitar-congreso',
      });
    }

    return guardada;
  }

  private normalizeTags(tags?: string[]): string[] {
    return [...new Set((tags || []).map((tag) => tag.trim()).filter(Boolean))];
  }
}
