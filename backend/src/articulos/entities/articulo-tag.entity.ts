import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Articulo } from './articulo.entity';
import { Tag } from '../../congresos/entities/tag.entity';

@Entity('articulo_tags')
export class ArticuloTag {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  articulo_id: string;

  @Column('uuid')
  tag_id: string;

  @ManyToOne(() => Articulo)
  @JoinColumn({ name: 'articulo_id' })
  articulo: Articulo;

  @ManyToOne(() => Tag)
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;
}
