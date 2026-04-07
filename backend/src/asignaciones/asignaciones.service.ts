import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asignacion } from './entities/asignacion.entity';
import { User, Rol } from '../users/entities/user.entity';
import { Perfil } from '../users/entities/perfil.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AsignacionesService {
  constructor(
    @InjectRepository(Asignacion)
    private readonly asignacionRepository: Repository<Asignacion>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Perfil)
    private readonly perfilRepository: Repository<Perfil>,
  ) {}

  async findAll(includeRelations: boolean = false) {
    const relations = includeRelations ? ['articulo', 'revisor', 'articulo.autor'] : [];
    return this.asignacionRepository.find({ relations });
  }

  async findByRevisor(revisorId: string, includeRelations: boolean = false) {
    const relations = includeRelations ? ['articulo', 'revisor', 'articulo.autor'] : [];
    return this.asignacionRepository.find({
      where: { revisor_id: revisorId },
      relations
    });
  }

  async findOne(id: string, includeRelations: boolean = false) {
    const relations = includeRelations ? ['articulo', 'revisor', 'articulo.autor'] : [];
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
        const totalAsignados = await this.asignacionRepository.count({
          where: { revisor_id: revisor.id },
        });

        const asignaciones = await this.asignacionRepository.find({
          where: { revisor_id: revisor.id },
          relations: ['articulo'],
        });

        return {
          id: revisor.id,
          email: revisor.email,
          rol: revisor.rol,
          nombre: revisor.perfil?.nombre || revisor.email,
          carrera: revisor.perfil?.carrera || '',
          especialidades: revisor.perfil?.especialidades || [],
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

    // Verificar límite de 3 artículos
    const totalActual = await this.asignacionRepository.count({
      where: { revisor_id },
    });
    if (totalActual >= 3) {
      throw new BadRequestException(
        `El revisor ya tiene ${totalActual} artículos asignados. No se pueden asignar más de 3.`,
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
}
