import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Congreso } from './congreso.entity';
import { EditorTag } from './editor-tag.entity';

@Entity('tags')
export class Tag {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column('uuid')
  congreso_id: string;

  @ManyToOne(() => Congreso, (congreso) => congreso.tags)
  @JoinColumn({ name: 'congreso_id' })
  congreso: Congreso;

  @OneToMany(() => EditorTag, (et) => et.tag)
  editores: EditorTag[];
}
