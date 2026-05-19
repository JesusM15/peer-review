import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Articulo, EstadoArticulo } from '../articulos/entities/articulo.entity';
import { User, Rol } from '../users/entities/user.entity';
import { Asignacion } from '../asignaciones/entities/asignacion.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Articulo)
    private articuloRepository: Repository<Articulo>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Asignacion)
    private asignacionRepository: Repository<Asignacion>,
  ) {}

  async getDashboard(userId: string, userRole: Rol, subEditorId?: string) {
    // Si es Editor en Jefe, puede ver todos los artículos del congreso
    // Si es Sub-Editor, solo puede ver los artículos que él asignó
    if (userRole === Rol.SUB_EDITOR) {
      return this.getSubEditorDashboard(userId);
    } else if (userRole === Rol.EDITOR_JEFE) {
      return this.getEditorJefeDashboard(subEditorId);
    } else if (userRole === Rol.EDITOR) {
      // Editor regular ve todos los artículos (comportamiento anterior)
      return this.getEditorDashboard();
    }

    throw new Error('Rol no autorizado para dashboard');
  }

  private async getSubEditorDashboard(userId: string) {
    // Obtener artículos asignados por este sub-editor
    const asignaciones = await this.asignacionRepository.find({
      where: { revisor_id: userId },
      relations: ['articulo', 'articulo.autor'],
    });

    const articulos = asignaciones.map(a => ({
      id: a.articulo.id,
      titulo: a.articulo.titulo,
      estado: a.articulo.estado,
      autor: a.articulo.autor?.nombre || 'N/A',
      fecha_limite: a.fecha_limite,
    }));

    return {
      rol: 'SubEditor',
      total_articulos: articulos.length,
      articulos,
      estadisticas: this.calcularEstadisticas(articulos),
    };
  }

  private async getEditorJefeDashboard(subEditorId?: string) {
    let queryBuilder = this.articuloRepository
      .createQueryBuilder('articulo')
      .leftJoinAndSelect('articulo.autor', 'autor')
      .leftJoinAndSelect('articulo.asignaciones', 'asignaciones')
      .leftJoinAndSelect('asignaciones.revisor', 'revisor');

    // Si se filtra por sub-editor específico
    if (subEditorId) {
      queryBuilder.andWhere('asignaciones.revisor_id = :subEditorId', { subEditorId });
    }

    const articulos = await queryBuilder.getMany();

    const articulosFormateados = articulos.map(a => ({
      id: a.id,
      titulo: a.titulo,
      estado: a.estado,
      autor: a.autor?.nombre || 'N/A',
      asignado_a: a.asignaciones?.map(asig => ({
        revisor_id: asig.revisor_id,
        revisor_nombre: asig.revisor?.nombre || 'N/A',
        fecha_limite: asig.fecha_limite,
      })) || [],
    }));

    // Obtener lista de sub-editores disponibles para el filtro
    const subEditores = await this.userRepository.find({
      where: { rol: Rol.SUB_EDITOR },
      select: ['id', 'nombre', 'email'],
    });

    return {
      rol: 'EditorJefe',
      total_articulos: articulosFormateados.length,
      articulos: articulosFormateados,
      sub_editores: subEditores,
      estadisticas: this.calcularEstadisticas(articulosFormateados),
    };
  }

  private async getEditorDashboard() {
    const articulos = await this.articuloRepository.find({
      relations: ['autor'],
    });

    const articulosFormateados = articulos.map(a => ({
      id: a.id,
      titulo: a.titulo,
      estado: a.estado,
      autor: a.autor?.nombre || 'N/A',
    }));

    return {
      rol: 'Editor',
      total_articulos: articulosFormateados.length,
      articulos: articulosFormateados,
      estadisticas: this.calcularEstadisticas(articulosFormateados),
    };
  }

  private calcularEstadisticas(articulos: any[]) {
    const porEstado = {
      [EstadoArticulo.BORRADOR]: 0,
      [EstadoArticulo.EN_REVISION]: 0,
      [EstadoArticulo.ACEPTADO]: 0,
      [EstadoArticulo.RECHAZADO]: 0,
    };

    articulos.forEach(a => {
      if (porEstado[a.estado] !== undefined) {
        porEstado[a.estado]++;
      }
    });

    return {
      por_estado: porEstado,
      total: articulos.length,
    };
  }
}
