import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';

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

  @OneToMany('Tag', 'congreso')
  tags: any[];

  @OneToMany('UsuarioCongresoRol', 'congreso')
  membresias: any[];
}
