import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('perfiles')
export class Perfil {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  carrera: string;

  @Column('simple-array')
  especialidades: string[];

  @OneToOne(() => User, (user) => user.perfil)
  @JoinColumn({ name: 'id' })
  user: User;
}
