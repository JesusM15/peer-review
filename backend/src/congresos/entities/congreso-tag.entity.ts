import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Congreso } from './congreso.entity';
import { Tag } from './tag.entity';

@Entity('congreso_tags')
export class CongresoTag {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  congreso_id: string;

  @Column('uuid')
  tag_id: string;

  @ManyToOne(() => Congreso)
  @JoinColumn({ name: 'congreso_id' })
  congreso: Congreso;

  @ManyToOne(() => Tag)
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;
}
