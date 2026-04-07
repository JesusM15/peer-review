import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Rol } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(options: { rol?: Rol; include_relations?: boolean }) {
    const relations = options.include_relations ? ['perfil'] : [];
    const where: any = {};
    
    if (options.rol) {
      where.rol = options.rol;
    }
    
    return this.userRepository.find({ where, relations });
  }

  async findOne(id: string, includeRelations: boolean = false) {
    const relations = includeRelations ? ['perfil'] : [];
    return this.userRepository.findOne({ where: { id }, relations });
  }
}
