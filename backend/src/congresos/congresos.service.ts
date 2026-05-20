import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Congreso } from './entities/congreso.entity';
import { Tag } from './entities/tag.entity';
import { UsuarioCongresoRol } from './entities/usuario-congreso-rol.entity';
import { EditorTag } from './entities/editor-tag.entity';
import { RevisorTag } from './entities/revisor-tag.entity';
import { CongresoTag } from './entities/congreso-tag.entity';
import { v4 as uuidv4 } from 'uuid';
import { Rol } from '../users/entities/user.entity';

@Injectable()
export class CongresosService {
  constructor(
    @InjectRepository(Congreso)
    private congresoRepo: Repository<Congreso>,
    @InjectRepository(Tag)
    private tagRepo: Repository<Tag>,
    @InjectRepository(UsuarioCongresoRol)
    private ucrRepo: Repository<UsuarioCongresoRol>,
    @InjectRepository(EditorTag)
    private editorTagRepo: Repository<EditorTag>,
    @InjectRepository(RevisorTag)
    private revisorTagRepo: Repository<RevisorTag>,
    @InjectRepository(CongresoTag)
    private congresoTagRepo: Repository<CongresoTag>,
  ) {}

  async createCongreso(
    nombre: string,
    descripcion?: string,
    tags?: string[],
  ): Promise<Congreso> {
    const congreso = this.congresoRepo.create({
      id: uuidv4(),
      nombre,
      descripcion,
    });
    const savedCongreso = await this.congresoRepo.save(congreso);

    // Create tags if provided
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        const tag = this.tagRepo.create({
          id: uuidv4(),
          nombre: tagName,
          congreso_id: savedCongreso.id,
        });
        await this.tagRepo.save(tag);
      }
    }

    return savedCongreso;
  }

  async findAll(): Promise<Congreso[]> {
    return this.congresoRepo.find({ relations: ['tags'] });
  }

  async findOne(id: string): Promise<Congreso> {
    const congreso = await this.congresoRepo.findOne({
      where: { id },
      relations: ['tags'],
    });
    if (!congreso) throw new NotFoundException('Congreso no encontrado');
    return congreso;
  }

  async updateCongreso(
    id: string,
    nombre?: string,
    descripcion?: string,
    tags?: string[],
  ): Promise<Congreso> {
    const congreso = await this.congresoRepo.findOne({ where: { id } });
    if (!congreso) throw new NotFoundException('Congreso no encontrado');

    if (nombre) congreso.nombre = nombre;
    if (descripcion !== undefined) congreso.descripcion = descripcion;

    const savedCongreso = await this.congresoRepo.save(congreso);

    // Update tags if provided
    if (tags) {
      // Remove existing tags
      await this.tagRepo.delete({ congreso_id: id });

      // Add new tags
      for (const tagName of tags) {
        const tag = this.tagRepo.create({
          id: uuidv4(),
          nombre: tagName,
          congreso_id: savedCongreso.id,
        });
        await this.tagRepo.save(tag);
      }
    }

    return savedCongreso;
  }

  async addTag(congresoId: string, nombre: string): Promise<Tag> {
    const congreso = await this.congresoRepo.findOne({
      where: { id: congresoId },
    });
    if (!congreso) throw new NotFoundException('Congreso no encontrado');

    const tag = this.tagRepo.create({
      id: uuidv4(),
      nombre,
      congreso_id: congresoId,
    });
    return this.tagRepo.save(tag);
  }

  async enrollUser(
    userId: string,
    congresoId: string,
    rol: Rol,
  ): Promise<UsuarioCongresoRol> {
    const existing = await this.ucrRepo.findOne({
      where: { user_id: userId, congreso_id: congresoId },
    });
    if (existing) {
      existing.rol = rol;
      return this.ucrRepo.save(existing);
    }

    const ucr = this.ucrRepo.create({
      id: uuidv4(),
      user_id: userId,
      congreso_id: congresoId,
      rol,
    });
    return this.ucrRepo.save(ucr);
  }

  async assignEditorToTag(
    userId: string,
    tagId: string,
    congresoId: string,
  ): Promise<EditorTag> {
    // Verificar que el usuario tiene rol EDITOR en ese congreso
    const membership = await this.ucrRepo.findOne({
      where: { user_id: userId, congreso_id: congresoId, rol: Rol.EDITOR },
    });
    if (!membership)
      throw new BadRequestException('El usuario no es Editor en este congreso');

    const et = this.editorTagRepo.create({
      id: uuidv4(),
      user_id: userId,
      tag_id: tagId,
      congreso_id: congresoId,
    });
    return this.editorTagRepo.save(et);
  }

  async getMemberships(userId: string): Promise<UsuarioCongresoRol[]> {
    return this.ucrRepo.find({
      where: { user_id: userId },
      relations: ['congreso'],
    });
  }

  /**
   * Asigna etiquetas de especialidad a un revisor en un congreso específico
   */
  async assignRevisorToTag(
    userId: string,
    tagId: string,
    congresoId: string,
  ): Promise<RevisorTag> {
    // Verificar que el usuario tiene rol REVISOR en ese congreso
    const membership = await this.ucrRepo.findOne({
      where: { user_id: userId, congreso_id: congresoId, rol: Rol.REVISOR },
    });
    if (!membership)
      throw new BadRequestException(
        'El usuario no es Revisor en este congreso',
      );

    // Verificar que la etiqueta existe y pertenece a este congreso
    const tag = await this.tagRepo.findOne({
      where: { id: tagId, congreso_id: congresoId },
    });
    if (!tag)
      throw new BadRequestException('La etiqueta no existe en este congreso');

    // Verificar que no exista ya
    const existing = await this.revisorTagRepo.findOne({
      where: { user_id: userId, tag_id: tagId, congreso_id: congresoId },
    });
    if (existing)
      throw new BadRequestException(
        'El revisor ya tiene esta etiqueta asignada',
      );

    const rt = this.revisorTagRepo.create({
      id: uuidv4(),
      user_id: userId,
      tag_id: tagId,
      congreso_id: congresoId,
    });
    return this.revisorTagRepo.save(rt);
  }

  /**
   * Obtiene todas las etiquetas de un revisor en un congreso
   */
  async getRevisorTags(
    userId: string,
    congresoId: string,
  ): Promise<RevisorTag[]> {
    return this.revisorTagRepo.find({
      where: { user_id: userId, congreso_id: congresoId },
      relations: ['tag'],
    });
  }

  /**
   * Remueve una etiqueta de un revisor
   */
  async removeRevisorTag(revisorTagId: string): Promise<void> {
    const revisorTag = await this.revisorTagRepo.findOne({
      where: { id: revisorTagId },
    });
    if (!revisorTag)
      throw new NotFoundException('Asignación de etiqueta no encontrada');
    await this.revisorTagRepo.remove(revisorTag);
  }

  /**
   * Asigna etiquetas a un congreso
   */
  async assignCongresoTag(
    congresoId: string,
    tagId: string,
  ): Promise<CongresoTag> {
    const congreso = await this.congresoRepo.findOne({
      where: { id: congresoId },
    });
    if (!congreso) throw new NotFoundException('Congreso no encontrado');

    const tag = await this.tagRepo.findOne({
      where: { id: tagId, congreso_id: congresoId },
    });
    if (!tag)
      throw new BadRequestException('La etiqueta no existe en este congreso');

    // Verificar que no exista ya
    const existing = await this.congresoTagRepo.findOne({
      where: { congreso_id: congresoId, tag_id: tagId },
    });
    if (existing)
      throw new BadRequestException(
        'El congreso ya tiene esta etiqueta asignada',
      );

    const ct = this.congresoTagRepo.create({
      id: uuidv4(),
      congreso_id: congresoId,
      tag_id: tagId,
    });
    return this.congresoTagRepo.save(ct);
  }

  /**
   * Obtiene las etiquetas de un congreso
   */
  async getCongresoTags(congresoId: string): Promise<CongresoTag[]> {
    return this.congresoTagRepo.find({
      where: { congreso_id: congresoId },
      relations: ['tag'],
    });
  }

  /**
   * Remueve una etiqueta de un congreso
   */
  async removeCongresoTag(congresoTagId: string): Promise<void> {
    const congresoTag = await this.congresoTagRepo.findOne({
      where: { id: congresoTagId },
    });
    if (!congresoTag)
      throw new NotFoundException(
        'Asignación de etiqueta a congreso no encontrada',
      );
    await this.congresoTagRepo.remove(congresoTag);
  }

  /**
   * Valida si un revisor puede ser asignado a un congreso basándose en las etiquetas
   */
  async validateRevisorForCongreso(
    revisorId: string,
    congresoId: string,
  ): Promise<{ isValid: boolean; message?: string }> {
    // Obtener las etiquetas del congreso
    const congresoTags = await this.congresoTagRepo.find({
      where: { congreso_id: congresoId },
      relations: ['tag'],
    });

    if (congresoTags.length === 0) {
      // Si el congreso no tiene etiquetas, cualquier revisor puede ser asignado
      return { isValid: true };
    }

    const congresoTagNames = congresoTags.map((ct) =>
      ct.tag.nombre.toLowerCase(),
    );

    // Obtener las etiquetas del revisor en este congreso
    const revisorTags = await this.revisorTagRepo.find({
      where: { user_id: revisorId, congreso_id: congresoId },
      relations: ['tag'],
    });

    const revisorTagNames = revisorTags.map((rt) =>
      rt.tag.nombre.toLowerCase(),
    );

    if (revisorTagNames.length === 0) {
      return {
        isValid: false,
        message: `El revisor no tiene etiquetas de especialidad en este congreso. Etiquetas requeridas: ${congresoTagNames.join(', ')}`,
      };
    }

    // Verificar si hay al menos una coincidencia
    const hasMatch = congresoTagNames.some((tag) =>
      revisorTagNames.includes(tag),
    );

    if (!hasMatch) {
      return {
        isValid: false,
        message: `El revisor no tiene etiquetas que coincidan con las del congreso. Congreso: ${congresoTagNames.join(', ')}, Revisor: ${revisorTagNames.join(', ')}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Valida si un editor puede ser asignado a un congreso basándose en las etiquetas
   */
  async validateEditorForCongreso(
    editorId: string,
    congresoId: string,
  ): Promise<{ isValid: boolean; message?: string }> {
    // Obtener las etiquetas del congreso
    const congresoTags = await this.congresoTagRepo.find({
      where: { congreso_id: congresoId },
      relations: ['tag'],
    });

    if (congresoTags.length === 0) {
      // Si el congreso no tiene etiquetas, cualquier editor puede ser asignado
      return { isValid: true };
    }

    const congresoTagNames = congresoTags.map((ct) =>
      ct.tag.nombre.toLowerCase(),
    );

    // Obtener las etiquetas del editor en este congreso
    const editorTags = await this.editorTagRepo.find({
      where: { user_id: editorId, congreso_id: congresoId },
      relations: ['tag'],
    });

    const editorTagNames = editorTags.map((et) => et.tag.nombre.toLowerCase());

    if (editorTagNames.length === 0) {
      return {
        isValid: false,
        message: `El editor no tiene etiquetas de especialidad en este congreso. Etiquetas requeridas: ${congresoTagNames.join(', ')}`,
      };
    }

    // Verificar si hay al menos una coincidencia
    const hasMatch = congresoTagNames.some((tag) =>
      editorTagNames.includes(tag),
    );

    if (!hasMatch) {
      return {
        isValid: false,
        message: `El editor no tiene etiquetas que coincidan con las del congreso. Congreso: ${congresoTagNames.join(', ')}, Editor: ${editorTagNames.join(', ')}`,
      };
    }

    return { isValid: true };
  }
}
