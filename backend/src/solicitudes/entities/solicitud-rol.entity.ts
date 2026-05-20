import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User, Rol } from '../../users/entities/user.entity';
import { Congreso } from '../../congresos/entities/congreso.entity';

export enum EstadoSolicitud {
  PENDIENTE = 'Pendiente',
  APROBADO = 'Aprobado',
  RECHAZADO = 'Rechazado',
}

@Entity('solicitudes_rol')
export class SolicitudRol {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column('uuid')
  congreso_id: string;

  @Column({ type: 'enum', enum: Rol })
  rol_solicitado: Rol;

  @Column({
    type: 'enum',
    enum: EstadoSolicitud,
    default: EstadoSolicitud.PENDIENTE,
  })
  estado: EstadoSolicitud;

  @Column({ type: 'text', nullable: true })
  motivo_usuario?: string;

  @Column({ type: 'text', nullable: true })
  respuesta_admin?: string;

  @CreateDateColumn()
  fecha_creacion: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_resolucion?: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Congreso)
  @JoinColumn({ name: 'congreso_id' })
  congreso: Congreso;
}
