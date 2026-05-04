import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User, Rol } from '../../users/entities/user.entity';
import { Congreso } from './congreso.entity';

@Entity('usuario_congreso_rol')
export class UsuarioCongresoRol {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column('uuid')
  congreso_id: string;

  @Column({ type: 'enum', enum: Rol })
  rol: Rol;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Congreso, (congreso) => congreso.membresias)
  @JoinColumn({ name: 'congreso_id' })
  congreso: Congreso;
}
