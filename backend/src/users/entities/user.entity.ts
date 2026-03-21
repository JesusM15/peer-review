import { Entity, PrimaryColumn, Column, OneToOne } from 'typeorm';
import { Perfil } from './perfil.entity';

export enum Rol {
  AUTOR = 'Autor',
  REVISOR = 'Revisor',
  EDITOR = 'Editor',
}

@Entity('users')
export class User {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: Rol, default: Rol.AUTOR })
  rol: Rol;

  @OneToOne(() => Perfil, (perfil) => perfil.user)
  perfil: Perfil;
}
