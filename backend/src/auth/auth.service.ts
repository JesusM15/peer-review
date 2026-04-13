import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Rol } from '../users/entities/user.entity';
import { Perfil } from '../users/entities/perfil.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Perfil)
    private readonly perfilRepository: Repository<Perfil>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { nombre, email, password, rol } = registerDto;

    // Verificar si el email ya existe
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    // Crear nuevo usuario
    const user = this.userRepository.create({
      id: uuidv4(),
      nombre,
      email,
      password,
      rol,
    });

    await this.userRepository.save(user);

    const perfil = this.perfilRepository.create({
      id: user.id,
      nombre: user.nombre,
      carrera: '',
      especialidades: [],
    });
    await this.perfilRepository.save(perfil);

    // Generar JWT
    const token = this.generateToken(user);

    return {
      message: 'Usuario registrado exitosamente',
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Buscar usuario por email (incluyendo password para validación)
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Validar contraseña
    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar JWT
    const token = this.generateToken(user);

    return {
      message: 'Inicio de sesión exitoso',
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
      token,
    };
  }

  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      rol: user.rol,
    };

    return this.jwtService.sign(payload);
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('Token inválido');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }
}
