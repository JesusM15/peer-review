import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('perfiles')
export class Perfil {
  @PrimaryColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'id' })
  user: User;

  @Column()
  nombre: string;

  @Column()
  carrera: string;

  @Column('simple-array')
  especialidades: string[];
}