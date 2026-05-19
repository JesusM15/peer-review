import { Entity, PrimaryColumn, Column, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import * as bcrypt from 'bcryptjs';

export enum Rol {
  AUTOR = 'Autor',
  REVISOR = 'Revisor',
  EDITOR = 'Editor',
  EDITOR_JEFE = 'Editor Jefe',
  ADMIN = 'Admin',
}

@Entity('users')
export class User {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'varchar', length: 50, default: Rol.AUTOR })
  rol: Rol;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  async validatePassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.password);
  }
}
