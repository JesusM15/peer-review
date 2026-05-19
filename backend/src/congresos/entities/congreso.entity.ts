import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Tag } from './tag.entity';
import { UsuarioCongresoRol } from './usuario-congreso-rol.entity';

@Entity('congresos')
export class Congreso {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column({ type: 'date', nullable: true })
  fecha_inicio: Date;

  @Column({ type: 'date', nullable: true })
  fecha_fin: Date;

  @OneToMany(() => Tag, (tag) => tag.congreso)
  tags: Tag[];

  @OneToMany(() => UsuarioCongresoRol, (membresia) => membresia.congreso)
  membresias: UsuarioCongresoRol[];
}
