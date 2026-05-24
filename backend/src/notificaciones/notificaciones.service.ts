import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Notificacion, TipoNotificacion } from './entities/notificacion.entity';
import { User, Rol } from '../users/entities/user.entity';
import { Asignacion } from '../asignaciones/entities/asignacion.entity';
import { PushService } from './push.service';

interface CrearNotificacionInput {
  user_id: string;
  tipo: TipoNotificacion | string;
  titulo: string;
  mensaje: string;
  link?: string;
}

@Injectable()
export class NotificacionesService {
  constructor(
    @InjectRepository(Notificacion)
    private readonly notificacionRepo: Repository<Notificacion>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Asignacion)
    private readonly asignacionRepo: Repository<Asignacion>,
    private readonly pushService: PushService,
  ) {}

  async crear(data: CrearNotificacionInput): Promise<Notificacion> {
    const notif = this.notificacionRepo.create({
      id: uuidv4(),
      user_id: data.user_id,
      tipo: data.tipo,
      titulo: data.titulo,
      mensaje: data.mensaje,
      link: data.link,
      leida: false,
    });
    const saved = await this.notificacionRepo.save(notif);

    void this.pushService.sendToUser(data.user_id, {
      title: data.titulo,
      body: data.mensaje,
      url: data.link,
      tag: data.tipo,
    });

    return saved;
  }

  async notificarAdmins(
    input: Omit<CrearNotificacionInput, 'user_id'>,
  ): Promise<Notificacion[]> {
    const admins = await this.userRepo.find({ where: { rol: Rol.ADMIN } });
    const creadas: Notificacion[] = [];
    for (const admin of admins) {
      const notif = await this.crear({ ...input, user_id: admin.id });
      creadas.push(notif);
    }
    return creadas;
  }

  /**
   * Notifica al autor y a los revisores asignados cuando cambia el estado del artículo.
   */
  async notificarCambioEstadoArticulo(
    articulo: { id: string; titulo: string; autor_id: string },
    estadoAnterior: string,
    estadoNuevo: string,
  ): Promise<void> {
    if (!estadoNuevo || estadoAnterior === estadoNuevo) {
      return;
    }

    await this.crear({
      user_id: articulo.autor_id,
      tipo: TipoNotificacion.ARTICULO_ESTADO,
      titulo: 'Estado de tu artículo actualizado',
      mensaje: `"${articulo.titulo}" pasó de "${estadoAnterior}" a "${estadoNuevo}".`,
      link: '/author',
    });

    const asignaciones = await this.asignacionRepo.find({
      where: { articulo_id: articulo.id },
    });
    const revisorIds = [
      ...new Set(asignaciones.map((a) => a.revisor_id).filter(Boolean)),
    ];

    for (const revisorId of revisorIds) {
      if (revisorId === articulo.autor_id) continue;
      await this.crear({
        user_id: revisorId,
        tipo: TipoNotificacion.ARTICULO_ESTADO,
        titulo: 'Artículo asignado actualizado',
        mensaje: `"${articulo.titulo}" ahora está en estado "${estadoNuevo}".`,
        link: '/reviewer',
      });
    }
  }

  async findByUser(
    user_id: string,
    soloNoLeidas = false,
  ): Promise<Notificacion[]> {
    const where: { user_id: string; leida?: boolean } = { user_id };
    if (soloNoLeidas) where.leida = false;
    return this.notificacionRepo.find({
      where,
      order: { fecha_creacion: 'DESC' },
      take: 100,
    });
  }

  async contarNoLeidas(user_id: string): Promise<number> {
    return this.notificacionRepo.count({ where: { user_id, leida: false } });
  }

  async marcarLeida(id: string, user_id: string): Promise<Notificacion> {
    const notif = await this.notificacionRepo.findOne({ where: { id } });
    if (!notif) throw new NotFoundException('Notificación no encontrada.');
    if (notif.user_id !== user_id) {
      throw new ForbiddenException(
        'No puedes modificar notificaciones de otro usuario.',
      );
    }
    notif.leida = true;
    return this.notificacionRepo.save(notif);
  }

  async marcarTodasLeidas(user_id: string): Promise<{ actualizadas: number }> {
    const result = await this.notificacionRepo.update(
      { user_id, leida: false },
      { leida: true },
    );
    return { actualizadas: result.affected ?? 0 };
  }
}
