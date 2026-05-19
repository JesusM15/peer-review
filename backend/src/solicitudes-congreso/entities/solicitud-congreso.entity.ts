import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum EstadoSolicitudCongreso {
  PENDIENTE = 'Pendiente',
  APROBADO = 'Aprobado',
  RECHAZADO = 'Rechazado',
}

@Entity('solicitudes_congreso')
export class SolicitudCongreso {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  solicitante_id: string;

  @Column()
  nombre_propuesto: string;

  @Column({ type: 'text', nullable: true })
  descripcion_propuesta?: string;

  @Column({ type: 'date', nullable: true })
  fecha_inicio_propuesta?: Date;

  @Column({ type: 'date', nullable: true })
  fecha_fin_propuesta?: Date;

  @Column({ type: 'text', nullable: true })
  motivo?: string;

  @Column({ type: 'simple-array', nullable: true })
  tags?: string[];

  @Column({
    type: 'enum',
    enum: EstadoSolicitudCongreso,
    default: EstadoSolicitudCongreso.PENDIENTE,
  })
  estado: EstadoSolicitudCongreso;

  @Column({ type: 'text', nullable: true })
  respuesta_admin?: string;

  @Column({ type: 'uuid', nullable: true })
  congreso_creado_id?: string;

  @CreateDateColumn()
  fecha_creacion: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_resolucion?: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'solicitante_id' })
  solicitante: User;
}
