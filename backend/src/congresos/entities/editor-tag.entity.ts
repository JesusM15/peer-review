import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Tag } from './tag.entity';
import { Congreso } from './congreso.entity';

@Entity('editor_tags')
export class EditorTag {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column('uuid')
  tag_id: string;

  @Column('uuid')
  congreso_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Tag, (tag) => tag.editores)
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;

  @ManyToOne(() => Congreso)
  @JoinColumn({ name: 'congreso_id' })
  congreso: Congreso;
}
