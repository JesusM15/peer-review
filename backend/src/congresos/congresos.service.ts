import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Congreso } from './entities/congreso.entity';
import { Tag } from './entities/tag.entity';
import { UsuarioCongresoRol } from './entities/usuario-congreso-rol.entity';
import { EditorTag } from './entities/editor-tag.entity';
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
  ) {}

  async createCongreso(nombre: string, descripcion?: string): Promise<Congreso> {
    const congreso = this.congresoRepo.create({
      id: uuidv4(),
      nombre,
      descripcion,
    });
    return this.congresoRepo.save(congreso);
  }

  async findAll(): Promise<Congreso[]> {
    return this.congresoRepo.find({ relations: ['tags'] });
  }

  async addTag(congresoId: string, nombre: string): Promise<Tag> {
    const congreso = await this.congresoRepo.findOne({ where: { id: congresoId } });
    if (!congreso) throw new NotFoundException('Congreso no encontrado');

    const tag = this.tagRepo.create({
      id: uuidv4(),
      nombre,
      congreso_id: congresoId,
    });
    return this.tagRepo.save(tag);
  }

  async enrollUser(userId: string, congresoId: string, rol: Rol): Promise<UsuarioCongresoRol> {
    const existing = await this.ucrRepo.findOne({ where: { user_id: userId, congreso_id: congresoId } });
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

  async assignEditorToTag(userId: string, tagId: string, congresoId: string): Promise<EditorTag> {
    // Verificar que el usuario tiene rol EDITOR en ese congreso
    const membership = await this.ucrRepo.findOne({ where: { user_id: userId, congreso_id: congresoId, rol: Rol.EDITOR } });
    if (!membership) throw new BadRequestException('El usuario no es Editor en este congreso');

    const et = this.editorTagRepo.create({
      id: uuidv4(),
      user_id: userId,
      tag_id: tagId,
      congreso_id: congresoId,
    });
    return this.editorTagRepo.save(et);
  }

  async getMemberships(userId: string): Promise<UsuarioCongresoRol[]> {
    return this.ucrRepo.find({ where: { user_id: userId }, relations: ['congreso'] });
  }
}
