import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, Rol } from './entities/user.entity';
import { Perfil } from './entities/perfil.entity';
import { Articulo } from '../articulos/entities/articulo.entity';
import { Asignacion } from '../asignaciones/entities/asignacion.entity';
import { Revision } from '../asignaciones/schemas/revision.schema';

// ── Mock repositories ─────────────────────────────────────────────────────────
const mockUserRepo = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

const mockPerfilRepo = () => ({
  findOneBy: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

const mockRevisionModel = {
  find: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([]) }),
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 'user-1',
    nombre: 'Carlos García',
    email: 'carlos@test.com',
    password: 'hashed-pw',
    rol: Rol.AUTOR,
    perfil: null,
    hashPassword: jest.fn(),
    validatePassword: jest.fn().mockResolvedValue(true),
    ...overrides,
  } as unknown as User;
}

function makePerfil(overrides = {}): Perfil {
  return {
    id: 'user-1',
    nombre: 'Carlos García',
    carrera: 'Ingeniería de Software',
    especialidades: ['Redes', 'Cloud'],
    telefono: '5551234567',
    ...overrides,
  } as Perfil;
}

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('UsersService', () => {
  let service: UsersService;
  let userRepo: ReturnType<typeof mockUserRepo>;
  let perfilRepo: ReturnType<typeof mockPerfilRepo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useFactory: mockUserRepo },
        { provide: getRepositoryToken(Perfil), useFactory: mockPerfilRepo },
        { provide: getRepositoryToken(Articulo), useValue: { find: jest.fn(), findOne: jest.fn() } },
        { provide: getRepositoryToken(Asignacion), useValue: { find: jest.fn(), findOne: jest.fn() } },
        { provide: getModelToken(Revision.name), useValue: mockRevisionModel },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepo = module.get(getRepositoryToken(User));
    perfilRepo = module.get(getRepositoryToken(Perfil));
  });

  afterEach(() => jest.clearAllMocks());

  // ── findMe ────────────────────────────────────────────────────────────────
  describe('findMe', () => {
    it('returns user data without password field', async () => {
      const user = makeUser({ perfil: makePerfil() });
      userRepo.findOne.mockResolvedValue(user);

      const result = await service.findMe('user-1');
      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe('carlos@test.com');
    });

    it('throws NotFoundException when user does not exist', async () => {
      userRepo.findOne.mockResolvedValue(null);
      await expect(service.findMe('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  // ── updateMe ──────────────────────────────────────────────────────────────
  describe('updateMe', () => {
    it('throws NotFoundException when user does not exist', async () => {
      userRepo.findOneBy.mockResolvedValue(null);
      await expect(
        service.updateMe('non-existent', { nombre: 'Nuevo Nombre' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('creates a new perfil when user has none', async () => {
      const user = makeUser();
      userRepo.findOneBy.mockResolvedValue(user);
      perfilRepo.findOneBy.mockResolvedValue(null);
      const newPerfil = makePerfil({ nombre: 'Carlos García', carrera: '', especialidades: [] });
      perfilRepo.create.mockReturnValue(newPerfil);
      perfilRepo.save.mockResolvedValue(newPerfil);
      userRepo.save.mockResolvedValue(user);
      // findMe call at end
      userRepo.findOne.mockResolvedValue({ ...user, perfil: newPerfil, password: 'hashed' });

      const result = await service.updateMe('user-1', { nombre: 'Carlos García' });

      expect(perfilRepo.create).toHaveBeenCalled();
      expect(perfilRepo.save).toHaveBeenCalled();
      expect(result).not.toHaveProperty('password');
    });

    it('updates existing perfil fields correctly', async () => {
      const user = makeUser();
      const existingPerfil = makePerfil();
      userRepo.findOneBy.mockResolvedValue(user);
      perfilRepo.findOneBy.mockResolvedValue(existingPerfil);
      userRepo.save.mockResolvedValue(user);
      perfilRepo.save.mockResolvedValue(existingPerfil);
      userRepo.findOne.mockResolvedValue({ ...user, perfil: existingPerfil, password: 'hashed' });

      await service.updateMe('user-1', {
        nombre: 'Carlos Updated',
        carrera: 'Computer Science',
        especialidades: ['IA', 'ML'],
        telefono: '5559876543',
      });

      expect(existingPerfil.nombre).toBe('Carlos Updated');
      expect(existingPerfil.carrera).toBe('Computer Science');
      expect(existingPerfil.especialidades).toEqual(expect.arrayContaining(['IA', 'ML']));
      expect(existingPerfil.telefono).toBe('5559876543');
      expect(perfilRepo.save).toHaveBeenCalledWith(existingPerfil);
    });

    it('deduplicates and trims especialidades tags', async () => {
      const user = makeUser();
      const perfil = makePerfil({ especialidades: [] });
      userRepo.findOneBy.mockResolvedValue(user);
      perfilRepo.findOneBy.mockResolvedValue(perfil);
      userRepo.save.mockResolvedValue(user);
      perfilRepo.save.mockResolvedValue(perfil);
      userRepo.findOne.mockResolvedValue({ ...user, perfil, password: 'x' });

      await service.updateMe('user-1', {
        especialidades: ['  IA  ', 'ML', 'IA', '', 'Cloud'],
      });

      expect(perfil.especialidades).toEqual(expect.arrayContaining(['IA', 'ML', 'Cloud']));
      expect(perfil.especialidades).not.toContain('');
      // No duplicates: 'IA' should appear only once
      expect(perfil.especialidades.filter(t => t === 'IA')).toHaveLength(1);
    });
  });

  // ── findAll ───────────────────────────────────────────────────────────────
  describe('findAll', () => {
    it('filters by rol when provided', async () => {
      userRepo.find.mockResolvedValue([]);
      await service.findAll({ rol: Rol.REVISOR });
      expect(userRepo.find).toHaveBeenCalledWith({
        where: { rol: Rol.REVISOR },
        relations: [],
      });
    });

    it('includes relations when include_relations is true', async () => {
      userRepo.find.mockResolvedValue([]);
      await service.findAll({ include_relations: true });
      expect(userRepo.find).toHaveBeenCalledWith({
        where: {},
        relations: ['perfil'],
      });
    });

    it('returns all users with no filters', async () => {
      const users = [makeUser(), makeUser({ id: 'user-2', email: 'b@test.com' })];
      userRepo.find.mockResolvedValue(users);
      const result = await service.findAll({});
      expect(result).toHaveLength(2);
    });
  });

  // ── findOne ───────────────────────────────────────────────────────────────
  describe('findOne', () => {
    it('returns null when user is not found', async () => {
      userRepo.findOne.mockResolvedValue(null);
      const result = await service.findOne('unknown-id');
      expect(result).toBeNull();
    });

    it('returns user with perfil relation when includeRelations=true', async () => {
      const user = makeUser({ perfil: makePerfil() });
      userRepo.findOne.mockResolvedValue(user);
      await service.findOne('user-1', true);
      expect(userRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        relations: ['perfil'],
      });
    });
  });
});
