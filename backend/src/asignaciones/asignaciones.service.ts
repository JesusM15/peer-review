import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asignacion } from './entities/asignacion.entity';
import { User, Rol } from '../users/entities/user.entity';
import {
  Articulo,
  EstadoArticulo,
} from '../articulos/entities/articulo.entity';
import { Revision, RevisionDocument } from './schemas/revision.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { ArticuloTag } from '../articulos/entities/articulo-tag.entity';
import { Tag } from '../congresos/entities/tag.entity';
import { EditorTag } from '../congresos/entities/editor-tag.entity';
import { RevisorTag } from '../congresos/entities/revisor-tag.entity';
import { Congreso } from '../congresos/entities/congreso.entity';
import { UsuarioCongresoRol } from '../congresos/entities/usuario-congreso-rol.entity';
import { NotificacionesService } from '../notificaciones/notificaciones.service';

@Injectable()
export class AsignacionesService {
  constructor(
    @InjectRepository(Asignacion)
    private readonly asignacionRepository: Repository<Asignacion>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Articulo)
    private readonly articuloRepository: Repository<Articulo>,
    @InjectRepository(ArticuloTag)
    private readonly articuloTagRepository: Repository<ArticuloTag>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(EditorTag)
    private readonly editorTagRepository: Repository<EditorTag>,
    @InjectRepository(RevisorTag)
    private readonly revisorTagRepository: Repository<RevisorTag>,
    @InjectRepository(Congreso)
    private readonly congresoRepository: Repository<Congreso>,
    @InjectRepository(UsuarioCongresoRol)
    private readonly ucrRepository: Repository<UsuarioCongresoRol>,
    @InjectModel(Revision.name)
    private readonly revisionModel: Model<RevisionDocument>,
    private readonly notificacionesService: NotificacionesService,
  ) {}

  async findAll(includeRelations: boolean = false) {
    const relations = includeRelations
      ? [
          'articulo',
          'revisor',
          'revisor.perfil',
          'articulo.autor',
          'articulo.autor.perfil',
        ]
      : [];
    return this.asignacionRepository.find({ relations });
  }

  async findByRevisor(revisorId: string, includeRelations: boolean = false) {
    try {
      const relations = includeRelations
        ? [
            'articulo',
            'revisor',
            'revisor.perfil',
            'articulo.autor',
            'articulo.autor.perfil',
          ]
        : [];
      return this.asignacionRepository.find({
        where: { revisor_id: revisorId },
        relations,
      });
    } catch (error) {
      console.error('Error en findByRevisor:', error);
      const relations = includeRelations ? ['articulo', 'revisor'] : [];
      return this.asignacionRepository.find({
        where: { revisor_id: revisorId },
        relations,
      });
    }
  }

  async findByArticulo(articuloId: string, includeRelations: boolean = false) {
    const relations = includeRelations
      ? ['articulo', 'revisor', 'revisor.perfil', 'articulo.autor', 'articulo.autor.perfil']
      : [];
    return this.asignacionRepository.find({
      where: { articulo_id: articuloId },
      relations,
    });
  }

  async findOne(id: string, includeRelations: boolean = false) {
    const relations = includeRelations
      ? [
          'articulo',
          'revisor',
          'revisor.perfil',
          'articulo.autor',
          'articulo.autor.perfil',
        ]
      : [];
    const asignacion = await this.asignacionRepository.findOne({
      where: { id },
      relations,
    });

    if (!asignacion) {
      throw new NotFoundException(`Asignación con ID ${id} no encontrada`);
    }

    return asignacion;
  }

  /**
   * Lista revisores con cuántos artículos tienen asignados.
   * Si se proporciona congreso_id, solo devuelve revisores de ESE congreso.
   */
  async findRevisoresConConteo(congresoId?: string) {
    let userIds: string[];

    if (congresoId) {
      // Paso 1: obtener IDs de usuarios con rol Revisor en este congreso
      const membresías = await this.ucrRepository.find({
        where: { congreso_id: congresoId, rol: Rol.REVISOR },
      });
      userIds = membresías.map(m => m.user_id);
    } else {
      // Sin congreso: buscar usuarios con rol global Revisor
      const revisoresGlobales = await this.userRepository.find({
        where: { rol: Rol.REVISOR },
      });
      userIds = revisoresGlobales.map(u => u.id);
    }

    if (userIds.length === 0) {
      return [];
    }

    // Paso 2: cargar los usuarios con su perfil
    const revisores = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.perfil', 'perfil')
      .where('user.id IN (:...ids)', { ids: userIds })
      .getMany();

    // Paso 3: contar asignaciones activas por revisor
    const resultados = await Promise.all(
      revisores.map(async (revisor) => {
        const asignaciones = await this.asignacionRepository.find({
          where: { revisor_id: revisor.id },
          relations: ['articulo'],
        });

        const totalAsignados = asignaciones.filter(a =>
          a.articulo &&
          a.articulo.estado !== EstadoArticulo.ACEPTADO &&
          a.articulo.estado !== EstadoArticulo.RECHAZADO
        ).length;

        return {
          id: revisor.id,
          email: revisor.email,
          rol: revisor.rol,
          nombre: revisor.perfil?.nombre || revisor.nombre || revisor.email,
          carrera: revisor.perfil?.carrera || '',
          especialidades: revisor.perfil?.especialidades || [],
          telefono: revisor.perfil?.telefono || null,
          articulos_asignados: totalAsignados,
          puede_recibir_mas: totalAsignados < 3,
          articulos: asignaciones.map((a) => ({
            id: a.articulo_id,
            titulo: a.articulo?.titulo || '',
            estado: a.articulo?.estado || '',
            fecha_limite: a.fecha_limite,
          })),
        };
      }),
    );

    return resultados;
  }

  /**
   * Asigna un revisor a un artículo.
   * Regla: un revisor no puede tener más de 3 artículos en revisión.
   * Regla: el revisor debe tener al menos una etiqueta que coincida con las etiquetas del artículo.
   */
  async create(data: {
    articulo_id: string;
    revisor_id: string;
    fecha_limite?: string;
  }) {
    const { articulo_id, revisor_id, fecha_limite } = data;

    // Verificar que el revisor existe
    const revisor = await this.userRepository.findOne({
      where: { id: revisor_id },
      relations: ['perfil'],
    });
    if (!revisor) {
      throw new NotFoundException(`Revisor con ID ${revisor_id} no encontrado`);
    }

    // --- REGLA: No auto-revisión ---
    const articulo = await this.articuloRepository.findOne({
      where: { id: articulo_id },
      relations: ['tags', 'tags.tag', 'congreso'],
    });
    if (!articulo) {
      throw new NotFoundException(
        `Artículo con ID ${articulo_id} no encontrado`,
      );
    }
    if (articulo.autor_id === revisor_id) {
      throw new BadRequestException(
        'Un autor no puede revisar su propio artículo (Conflicto de interés)',
      );
    }

    // --- REGLA: Coincidencia de etiquetas/especialidades ---
    // Obtener las etiquetas del artículo
    const articuloTags = await this.articuloTagRepository.find({
      where: { articulo_id },
      relations: ['tag'],
    });
    const tagNames = articuloTags.map((at) => at.tag.nombre.toLowerCase());

    // Obtener el congreso del artículo
    const congreso_id = articulo.congreso_id;

    // Obtener las etiquetas del revisor en el contexto del congreso (si hay congreso)
    let revisorTagNames: string[] = [];
    if (congreso_id) {
      const revisorTags = await this.revisorTagRepository.find({
        where: { user_id: revisor_id, congreso_id },
        relations: ['tag'],
      });
      revisorTagNames = revisorTags.map((rt) => rt.tag.nombre.toLowerCase());
    }

    // Si no hay tags del revisor en el congreso, usar las especialidades del perfil como fallback
    if (revisorTagNames.length === 0) {
      revisorTagNames = (revisor.perfil?.especialidades || []).map((e) =>
        e.toLowerCase(),
      );
    }

    // Verificar si hay al menos una coincidencia
    if (tagNames.length > 0 && revisorTagNames.length > 0) {
      const hasMatch = tagNames.some((tag) => revisorTagNames.includes(tag));
      if (!hasMatch) {
        throw new BadRequestException(
          `El revisor no tiene especialidades que coincidan con las etiquetas del artículo. ` +
            `Etiquetas del artículo: ${tagNames.join(', ')}. ` +
            `Especialidades del revisor: ${revisorTagNames.join(', ')}`,
        );
      }
    }

    // --- REGLA: Máximo 3 revisores por artículo ---
    const revisoresAsignados = await this.asignacionRepository.count({
      where: { articulo_id },
    });
    if (revisoresAsignados >= 3) {
      throw new BadRequestException(
        'Este artículo ya tiene el máximo de 3 revisores asignados',
      );
    }

    // Verificar límite de 3 artículos ACTIVOS (Solo los que no han sido aceptados/rechazados)
    const asignacionesActuales = await this.asignacionRepository.find({
      where: { revisor_id },
      relations: ['articulo'],
    });

    const activos = asignacionesActuales.filter(
      (a) =>
        a.articulo &&
        a.articulo.estado !== EstadoArticulo.ACEPTADO &&
        a.articulo.estado !== EstadoArticulo.RECHAZADO,
    );

    if (activos.length >= 3) {
      throw new BadRequestException(
        `El revisor ya tiene ${activos.length} artículos en revisión activa. No se pueden asignar más de 3.`,
      );
    }

    // Verificar si ya está asignado este revisor a este artículo
    const yaExiste = await this.asignacionRepository.findOne({
      where: { articulo_id, revisor_id },
    });
    if (yaExiste) {
      throw new ConflictException(
        `Este revisor ya está asignado a este artículo`,
      );
    }

    const nuevaAsignacion = this.asignacionRepository.create({
      id: uuidv4(),
      articulo_id,
      revisor_id,
      fecha_limite: fecha_limite
        ? new Date(fecha_limite)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    // Cambiar estado del artículo a EN_REVISION si estaba en BORRADOR
    if (articulo.estado === EstadoArticulo.BORRADOR) {
      const estadoAnterior = articulo.estado;
      articulo.estado = EstadoArticulo.EN_REVISION;
      await this.articuloRepository.save(articulo);
      await this.notificacionesService.notificarCambioEstadoArticulo(
        {
          id: articulo.id,
          titulo: articulo.titulo,
          autor_id: articulo.autor_id,
        },
        estadoAnterior,
        articulo.estado,
      );
    }

    return this.asignacionRepository.save(nuevaAsignacion);
  }

  async remove(id: string) {
    const asignacion = await this.asignacionRepository.findOne({
      where: { id },
    });
    if (!asignacion) {
      throw new NotFoundException(`Asignación con ID ${id} no encontrada`);
    }
    await this.asignacionRepository.delete(id);
    return { message: `Asignación eliminada correctamente` };
  }

  /**
   * Procesa la entrega de una revisión
   * 1. Guarda los comentarios detallados en MongoDB
   * 2. Actualiza el estado del artículo en MariaDB
   * 3. Remueve o marca la asignación como completada (en este diseño, se elimina al terminar)
   */
  async submitRevision(data: {
    articulo_id: string;
    revisor_id: string;
    decision: string;
    comentarios: any;
    fecha_revision: string;
  }) {
    const { articulo_id, revisor_id, decision, comentarios, fecha_revision } =
      data;

    // 1. Guardar en MongoDB (Mongoose)
    const nuevaRevision = new this.revisionModel({
      _id: uuidv4(),
      articulo_id,
      revisor_id,
      decision,
      secciones: comentarios, // <--- Mapeamos los comentarios al campo secciones del esquema
      fecha_revision: new Date(fecha_revision),
    });
    await nuevaRevision.save();

    // 2. Actualizar estado del artículo en MariaDB (TypeORM)
    const articulo = await this.articuloRepository.findOne({
      where: { id: articulo_id },
    });
    if (articulo) {
      const estadoAnterior = articulo.estado;
      if (decision === 'aceptado') {
        articulo.estado = EstadoArticulo.ACEPTADO;
      } else if (decision === 'revision') {
        articulo.estado = EstadoArticulo.EN_REVISION;
      } else {
        articulo.estado = EstadoArticulo.RECHAZADO;
      }
      await this.articuloRepository.save(articulo);
      if (estadoAnterior !== articulo.estado) {
        await this.notificacionesService.notificarCambioEstadoArticulo(
          {
            id: articulo.id,
            titulo: articulo.titulo,
            autor_id: articulo.autor_id,
          },
          estadoAnterior,
          articulo.estado,
        );
      }
    }

    // 3. Ya NO eliminamos la asignación para que el revisor pueda ver su historial y las estadísticas en el dashboard
    // Pero el artículo ahora está en estado ACEPTADO/RECHAZADO, por lo que no contará para el límite de 3.

    return {
      message: 'Revisión procesada exitosamente',
      revision_id: nuevaRevision.id,
      nuevo_estado: articulo?.estado,
    };
  }

  async findRevision(articulo_id: string, revisor_id: string) {
    return this.revisionModel.findOne({ articulo_id, revisor_id }).exec();
  }
}
