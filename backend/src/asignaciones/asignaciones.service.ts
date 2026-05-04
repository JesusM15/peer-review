import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asignacion } from './entities/asignacion.entity';
import { User, Rol } from '../users/entities/user.entity';
import { Articulo, EstadoArticulo } from '../articulos/entities/articulo.entity';
import { Revision, RevisionDocument } from './schemas/revision.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AsignacionesService {
  constructor(
    @InjectRepository(Asignacion)
    private readonly asignacionRepository: Repository<Asignacion>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Articulo)
    private readonly articuloRepository: Repository<Articulo>,
    @InjectModel(Revision.name)
    private readonly revisionModel: Model<RevisionDocument>,
  ) { }

  async findAll(includeRelations: boolean = false) {
    const relations = includeRelations ? ['articulo', 'revisor', 'revisor.perfil', 'articulo.autor', 'articulo.autor.perfil'] : [];
    return this.asignacionRepository.find({ relations });
  }

  async findByRevisor(revisorId: string, includeRelations: boolean = false) {
    const relations = includeRelations ? ['articulo', 'revisor', 'revisor.perfil', 'articulo.autor', 'articulo.autor.perfil'] : [];
    return this.asignacionRepository.find({
      where: { revisor_id: revisorId },
      relations
    });
  }

  async findOne(id: string, includeRelations: boolean = false) {
    const relations = includeRelations ? ['articulo', 'revisor', 'revisor.perfil', 'articulo.autor', 'articulo.autor.perfil'] : [];
    const asignacion = await this.asignacionRepository.findOne({ where: { id }, relations });

    if (!asignacion) {
      throw new NotFoundException(`Asignación con ID ${id} no encontrada`);
    }

    return asignacion;
  }

  /**
   * Lista todos los revisores con cuántos artículos tienen asignados actualmente
   */
  async findRevisoresConConteo() {
    const revisores = await this.userRepository.find({
      where: { rol: Rol.REVISOR },
      relations: ['perfil'],
    });

    const resultados = await Promise.all(
      revisores.map(async (revisor) => {
        const asignaciones = await this.asignacionRepository.find({
          where: { revisor_id: revisor.id },
          relations: ['articulo'],
        });

        const totalAsignados = asignaciones.filter(a =>
          a.articulo && a.articulo.estado !== EstadoArticulo.ACEPTADO && a.articulo.estado !== EstadoArticulo.RECHAZADO
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
   */
  async create(data: { articulo_id: string; revisor_id: string; fecha_limite?: string }) {
    const { articulo_id, revisor_id, fecha_limite } = data;

    // Verificar que el revisor existe y tiene rol REVISOR
    const revisor = await this.userRepository.findOne({
      where: { id: revisor_id, rol: Rol.REVISOR },
    });
    if (!revisor) {
      throw new NotFoundException(`Revisor con ID ${revisor_id} no encontrado`);
    }

    // Verificar límite de 3 artículos ACTIVOS (Solo los que no han sido aceptados/rechazados)
    const asignacionesActuales = await this.asignacionRepository.find({
      where: { revisor_id },
      relations: ['articulo']
    });

    const activos = asignacionesActuales.filter(a =>
      a.articulo && a.articulo.estado !== EstadoArticulo.ACEPTADO && a.articulo.estado !== EstadoArticulo.RECHAZADO
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
      throw new ConflictException(`Este revisor ya está asignado a este artículo`);
    }

    const nuevaAsignacion = this.asignacionRepository.create({
      id: uuidv4(),
      articulo_id,
      revisor_id,
      fecha_limite: fecha_limite ? new Date(fecha_limite) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    // Cambiar estado del artículo a EN_REVISION
    const articulo = await this.articuloRepository.findOne({ where: { id: articulo_id } });
    if (articulo) {
      articulo.estado = EstadoArticulo.EN_REVISION;
      await this.articuloRepository.save(articulo);
    }

    return this.asignacionRepository.save(nuevaAsignacion);
  }

  async remove(id: string) {
    const asignacion = await this.asignacionRepository.findOne({ where: { id } });
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
    const { articulo_id, revisor_id, decision, comentarios, fecha_revision } = data;

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
    const articulo = await this.articuloRepository.findOne({ where: { id: articulo_id } });
    if (articulo) {
      // Mapear decisión a estado
      if (decision === 'aceptado') {
        articulo.estado = EstadoArticulo.ACEPTADO;
      } else if (decision === 'revision') {
        articulo.estado = EstadoArticulo.EN_REVISION;
      } else {
        articulo.estado = EstadoArticulo.RECHAZADO;
      }
      await this.articuloRepository.save(articulo);
    }

    // 3. Ya NO eliminamos la asignación para que el revisor pueda ver su historial y las estadísticas en el dashboard
    // Pero el artículo ahora está en estado ACEPTADO/RECHAZADO, por lo que no contará para el límite de 3.

    return {
      message: 'Revisión procesada exitosamente',
      revision_id: nuevaRevision.id,
      nuevo_estado: articulo?.estado
    };
  }

  async findRevision(articulo_id: string, revisor_id: string) {
    return this.revisionModel.findOne({ articulo_id, revisor_id }).exec();
  }
}
