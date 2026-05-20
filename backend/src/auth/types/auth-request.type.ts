import { Request } from 'express';
import { Rol } from '../../users/entities/user.entity';

export interface AuthenticatedUser {
  id: string;
  email: string;
  rol: Rol;
  nombre: string;
}

export interface AuthRequest extends Request {
  user: AuthenticatedUser;
}
