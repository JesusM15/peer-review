import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('perfiles')
export class Perfil {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ nullable: true })
  nombre: string;

  @Column({ nullable: true })
  carrera: string;

  @Column('simple-array', { nullable: true })
  especialidades: string[];

  @OneToOne(() => User, (user) => user.perfil, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id' })
  user: User;
}
