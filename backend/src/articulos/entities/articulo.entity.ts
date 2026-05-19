import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Asignacion } from '../../asignaciones/entities/asignacion.entity';
import { Congreso } from '../../congresos/entities/congreso.entity';

export enum EstadoArticulo {
  BORRADOR = 'Borrador',
  EN_REVISION = 'En Revisión',
  ACEPTADO = 'Aceptado',
  RECHAZADO = 'Rechazado',
}

@Entity('articulos')
export class Articulo {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  titulo: string;

  @Column({ type: 'enum', enum: EstadoArticulo, default: EstadoArticulo.BORRADOR })
  estado: EstadoArticulo;

  @Column('uuid')
  autor_id: string;

  @Column('uuid', { nullable: true })
  congreso_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'autor_id' })
  autor: User;

  @ManyToOne(() => Congreso)
  @JoinColumn({ name: 'congreso_id' })
  congreso: Congreso;

  @OneToMany(() => Asignacion, asignacion => asignacion.articulo)
  asignaciones: Asignacion[];
}
