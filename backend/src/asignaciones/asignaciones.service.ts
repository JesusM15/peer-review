import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asignacion } from './entities/asignacion.entity';

@Injectable()
export class AsignacionesService {
  constructor(
    @InjectRepository(Asignacion)
    private readonly asignacionRepository: Repository<Asignacion>,
  ) {}

  async findAll(includeRelations: boolean = false) {
    const relations = includeRelations ? ['articulo', 'revisor', 'articulo.autor'] : [];
    return this.asignacionRepository.find({ relations });
  }

  async findOne(id: string, includeRelations: boolean = false) {
    const relations = includeRelations ? ['articulo', 'revisor', 'articulo.autor'] : [];
    const asignacion = await this.asignacionRepository.findOne({ where: { id }, relations });

    if (!asignacion) {
      throw new NotFoundException(`Asignación con ID ${id} no encontrada`);
    }

    return asignacion;
  }
}
