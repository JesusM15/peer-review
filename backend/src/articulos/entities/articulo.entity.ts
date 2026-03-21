import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

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

  @ManyToOne(() => User)
  @JoinColumn({ name: 'autor_id' })
  autor: User;
}
