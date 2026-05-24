import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum TipoNotificacion {
  SOLICITUD_CONGRESO_NUEVA = 'SolicitudCongresoNueva',
  SOLICITUD_CONGRESO_APROBADA = 'SolicitudCongresoAprobada',
  SOLICITUD_CONGRESO_RECHAZADA = 'SolicitudCongresoRechazada',
  ARTICULO_ESTADO = 'ArticuloEstado',
  GENERAL = 'General',
}

@Entity('notificaciones')
export class Notificacion {
  @PrimaryColumn('uuid')
  id: string;

  @Index()
  @Column('uuid')
  user_id: string;

  @Column({ type: 'varchar', length: 80 })
  tipo: string;

  @Column({ length: 200 })
  titulo: string;

  @Column({ type: 'text' })
  mensaje: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  link?: string;

  @Column({ default: false })
  leida: boolean;

  @CreateDateColumn()
  fecha_creacion: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
