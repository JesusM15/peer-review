import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { AsignacionesService } from './asignaciones.service';
import { Asignacion } from './entities/asignacion.entity';
import { User, Rol } from '../users/entities/user.entity';
import { Articulo, EstadoArticulo } from '../articulos/entities/articulo.entity';
import { ArticuloTag } from '../articulos/entities/articulo-tag.entity';
import { Tag } from '../congresos/entities/tag.entity';
import { EditorTag } from '../congresos/entities/editor-tag.entity';
import { RevisorTag } from '../congresos/entities/revisor-tag.entity';
import { Congreso } from '../congresos/entities/congreso.entity';
import { UsuarioCongresoRol } from '../congresos/entities/usuario-congreso-rol.entity';
import { Revision } from './schemas/revision.schema';

// ── Mock factories ────────────────────────────────────────────────────────────
const mockUserRepo = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([]),
  }),
});

const mockAsignacionRepo = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

const mockUCRRepo = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
});

const mockArticuloRepo = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
});

const mockSimpleRepo = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

const mockRevisionModel = {
  find: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([]) }),
  create: jest.fn().mockImplementation((dto: any) => ({ save: jest.fn().mockResolvedValue(dto) })),
};

// ── Helper: build a mock user ────────────────────────────────────────────────
function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 'user-1',
    nombre: 'Ana López',
    email: 'ana@test.com',
    password: 'hashed',
    rol: Rol.REVISOR,
    perfil: null,
    hashPassword: jest.fn(),
    validatePassword: jest.fn(),
    ...overrides,
  } as unknown as User;
}

function makePerfil(userId: string) {
  return { id: userId, nombre: 'Ana López', carrera: 'CS', especialidades: ['IA'], telefono: null };
}

// ── Tests ────────────────────────────────────────────────────────────────────
describe('AsignacionesService', () => {
  let service: AsignacionesService;
  let userRepo: ReturnType<typeof mockUserRepo>;
  let asignacionRepo: ReturnType<typeof mockAsignacionRepo>;
  let ucrRepo: ReturnType<typeof mockUCRRepo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AsignacionesService,
        { provide: getRepositoryToken(Asignacion), useFactory: mockAsignacionRepo },
        { provide: getRepositoryToken(User), useFactory: mockUserRepo },
        { provide: getRepositoryToken(Articulo), useFactory: mockArticuloRepo },
        { provide: getRepositoryToken(ArticuloTag), useFactory: mockSimpleRepo },
        { provide: getRepositoryToken(Tag), useFactory: mockSimpleRepo },
        { provide: getRepositoryToken(EditorTag), useFactory: mockSimpleRepo },
        { provide: getRepositoryToken(RevisorTag), useFactory: mockSimpleRepo },
        { provide: getRepositoryToken(Congreso), useFactory: mockSimpleRepo },
        { provide: getRepositoryToken(UsuarioCongresoRol), useFactory: mockUCRRepo },
        { provide: getModelToken(Revision.name), useValue: mockRevisionModel },
      ],
    }).compile();

    service = module.get<AsignacionesService>(AsignacionesService);
    userRepo = module.get(getRepositoryToken(User));
    asignacionRepo = module.get(getRepositoryToken(Asignacion));
    ucrRepo = module.get(getRepositoryToken(UsuarioCongresoRol));
  });

  afterEach(() => jest.clearAllMocks());

  // ── findRevisoresConConteo ──────────────────────────────────────────────────
  describe('findRevisoresConConteo', () => {
    it('returns empty array when no congress members have Revisor role', async () => {
      ucrRepo.find.mockResolvedValue([]);
      const result = await service.findRevisoresConConteo('congreso-1');
      expect(result).toEqual([]);
      expect(ucrRepo.find).toHaveBeenCalledWith({
        where: { congreso_id: 'congreso-1', rol: Rol.REVISOR },
      });
    });

    it('returns reviewers for a specific congress with assignment counts', async () => {
      const user = makeUser({ perfil: makePerfil('user-1') as any });
      ucrRepo.find.mockResolvedValue([{ user_id: 'user-1' }]);

      const qbMock = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([user]),
      };
      userRepo.createQueryBuilder.mockReturnValue(qbMock);

      // Two assignments: one active, one accepted (should not count)
      asignacionRepo.find.mockResolvedValue([
        { revisor_id: 'user-1', articulo_id: 'art-1', articulo: { estado: EstadoArticulo.EN_REVISION }, fecha_limite: null },
        { revisor_id: 'user-1', articulo_id: 'art-2', articulo: { estado: EstadoArticulo.ACEPTADO }, fecha_limite: null },
      ]);

      const result = await service.findRevisoresConConteo('congreso-1');

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('user-1');
      expect(result[0].articulos_asignados).toBe(1); // Only the active one
      expect(result[0].puede_recibir_mas).toBe(true);
      expect(result[0].especialidades).toEqual(['IA']);
    });

    it('returns global reviewers when no congreso_id provided', async () => {
      const user = makeUser();
      userRepo.find.mockResolvedValue([user]);

      const qbMock = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([user]),
      };
      userRepo.createQueryBuilder.mockReturnValue(qbMock);
      asignacionRepo.find.mockResolvedValue([]);

      const result = await service.findRevisoresConConteo();

      expect(userRepo.find).toHaveBeenCalledWith({ where: { rol: Rol.REVISOR } });
      expect(result).toHaveLength(1);
      expect(result[0].articulos_asignados).toBe(0);
      expect(result[0].puede_recibir_mas).toBe(true);
    });

    it('marks reviewer as unable to receive more when >= 3 active assignments', async () => {
      const user = makeUser({ perfil: makePerfil('user-1') as any });
      ucrRepo.find.mockResolvedValue([{ user_id: 'user-1' }]);

      const qbMock = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([user]),
      };
      userRepo.createQueryBuilder.mockReturnValue(qbMock);

      asignacionRepo.find.mockResolvedValue([
        { articulo: { estado: EstadoArticulo.EN_REVISION }, fecha_limite: null },
        { articulo: { estado: EstadoArticulo.EN_REVISION }, fecha_limite: null },
        { articulo: { estado: EstadoArticulo.EN_REVISION }, fecha_limite: null },
      ]);

      const result = await service.findRevisoresConConteo('congreso-1');
      expect(result[0].articulos_asignados).toBe(3);
      expect(result[0].puede_recibir_mas).toBe(false);
    });
  });

  // ── findAll ────────────────────────────────────────────────────────────────
  describe('findAll', () => {
    it('calls repository find without relations by default', async () => {
      asignacionRepo.find.mockResolvedValue([]);
      await service.findAll();
      expect(asignacionRepo.find).toHaveBeenCalledWith({ relations: [] });
    });

    it('calls repository find with relations when requested', async () => {
      asignacionRepo.find.mockResolvedValue([]);
      await service.findAll(true);
      expect(asignacionRepo.find).toHaveBeenCalledWith({
        relations: ['articulo', 'revisor', 'revisor.perfil', 'articulo.autor', 'articulo.autor.perfil'],
      });
    });
  });

  // ── findOne ────────────────────────────────────────────────────────────────
  describe('findOne', () => {
    it('throws NotFoundException when assignment does not exist', async () => {
      asignacionRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
    });

    it('returns the assignment when found', async () => {
      const asignacion = { id: 'asig-1', revisor_id: 'user-1', articulo_id: 'art-1' };
      asignacionRepo.findOne.mockResolvedValue(asignacion);
      const result = await service.findOne('asig-1');
      expect(result).toEqual(asignacion);
    });
  });

  // ── findByRevisor ──────────────────────────────────────────────────────────
  describe('findByRevisor', () => {
    it('returns assignments for a given reviewer ID', async () => {
      const asignaciones = [{ id: 'a1', revisor_id: 'user-1' }];
      asignacionRepo.find.mockResolvedValue(asignaciones);
      const result = await service.findByRevisor('user-1', false);
      expect(asignacionRepo.find).toHaveBeenCalledWith({
        where: { revisor_id: 'user-1' },
        relations: [],
      });
      expect(result).toEqual(asignaciones);
    });
  });
});
