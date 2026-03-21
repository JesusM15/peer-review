import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Articulo } from '../../articulos/entities/articulo.entity';
import { User } from '../../users/entities/user.entity';

@Entity('asignaciones')
export class Asignacion {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  articulo_id: string;

  @Column('uuid')
  revisor_id: string;

  @Column({ type: 'timestamp' })
  fecha_limite: Date;

  @ManyToOne(() => Articulo)
  @JoinColumn({ name: 'articulo_id' })
  articulo: Articulo;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'revisor_id' })
  revisor: User;
}
