import { DataSource } from 'typeorm';
import { User, Rol } from '../users/entities/user.entity';
import { Perfil } from '../users/entities/perfil.entity';
import { Articulo, EstadoArticulo } from '../articulos/entities/articulo.entity';
import { Asignacion } from '../asignaciones/entities/asignacion.entity';

/**
 * SEED: Usuarios de prueba (1 por rol)
 * Ejecutar con: npx ts-node src/database/seed.ts
 * O bien via Docker: docker exec -it peer_review_api npx ts-node src/database/seed.ts
 *
 * Contraseña de todos: password123 (sin hash por ahora, solo para pruebas)
 */

const AppDataSource = new DataSource({
  type: 'mariadb',
  url: process.env.MARIADB_URI || 'mysql://dbuser:dbpassword@mariadb:3306/peer_review_db',
  entities: [User, Perfil, Articulo, Asignacion],
  synchronize: false,
});

const SEED_USERS = [
  {
    id: '11111111-1111-4111-a111-111111111111',
    email: 'autor@diego.edu',
    password: 'password123',
    rol: Rol.AUTOR,
    nombre: 'Ana García',
  },
  {
    id: '22222222-2222-4222-a222-222222222222',
    email: 'revisor@diego.edu',
    password: 'password123',
    rol: Rol.REVISOR,
    nombre: 'Carlos Martínez',
  },
  {
    id: '33333333-3333-4333-a333-333333333333',
    email: 'editor@diego.edu',
    password: 'password123',
    rol: Rol.EDITOR,
    nombre: 'Laura Torres',
  },
  {
    id: '44444444-4444-4444-a444-444444444444',
    email: 'admin@diego.edu',
    password: 'admin123',
    rol: Rol.ADMIN,
    nombre: 'Administrador',
  },
];

async function runSeed() {
  console.log('🌱 Conectando a MariaDB...');
  await AppDataSource.initialize();
  console.log('✅ Conectado.\n');

  const userRepo = AppDataSource.getRepository(User);
  const articuloRepo = AppDataSource.getRepository(Articulo);
  const asignacionRepo = AppDataSource.getRepository(Asignacion);

  for (const seed of SEED_USERS) {
    // Buscar usuario por email (para detectar si existe aunque el ID cambie)
    const existingUserByEmail = await userRepo.findOne({ where: { email: seed.email } });
    
    if (existingUserByEmail) {
      // Eliminar usuario existente para recrearlo con contraseña hasheada
      await userRepo.remove(existingUserByEmail);
      console.log(`🗑️  Usuario existente eliminado: ${seed.email} (será recreado con hash)`);
    }

    // También verificar por ID por si cambió el email
    const existingUserById = await userRepo.findOne({ where: { id: seed.id } });
    if (existingUserById && existingUserById.email !== seed.email) {
      await userRepo.remove(existingUserById);
      console.log(`🗑️  Usuario con ID existente eliminado: ${existingUserById.email}`);
    }

    // Crear usuario nuevo (la contraseña se hashea automáticamente por @BeforeInsert)
    const user = userRepo.create({
      id: seed.id,
      nombre: seed.nombre,
      email: seed.email,
      password: seed.password,
      rol: seed.rol,
    });
    await userRepo.save(user);

    console.log(`✅ Usuario creado: ${seed.email} [${seed.rol}] — ID: ${seed.id}`);
  }

  // ASIGNACIÓN DE PRUEBA: Asignar revisor al artículo "ultimo"
  console.log('\n📝 Buscando artículo para asignar...');
  
  const revisor = await userRepo.findOne({ where: { email: 'revisor@diego.edu' } });
  
  // Buscar artículo por título que contenga "ultimo" o similar
  const articulos = await articuloRepo.find();
  const articuloUltimo = articulos.find(a => 
    a.titulo.toLowerCase().includes('ultimo') || 
    a.titulo.toLowerCase().includes('último')
  );

  if (!revisor) {
    console.log('❌ No se encontró el revisor de prueba (revisor@diego.edu)');
  } else if (!articuloUltimo) {
    console.log('❌ No se encontró ningún artículo con "ultimo" en el título');
    console.log(`   Artículos disponibles: ${articulos.map(a => `"${a.titulo}"`).join(', ')}`);
  } else {
    // Verificar si ya existe una asignación
    const asignacionExistente = await asignacionRepo.findOne({
      where: {
        articulo_id: articuloUltimo.id,
        revisor_id: revisor.id,
      },
    });

    if (asignacionExistente) {
      console.log(`⚠️  Ya existe asignación entre revisor "${revisor.email}" y artículo "${articuloUltimo.titulo}"`);
    } else {
      const asignacion = asignacionRepo.create({
        id: 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa',
        articulo_id: articuloUltimo.id,
        revisor_id: revisor.id,
        fecha_limite: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 días
      });
      await asignacionRepo.save(asignacion);

      // Actualizar estado del artículo a "En Revisión"
      articuloUltimo.estado = EstadoArticulo.EN_REVISION;
      await articuloRepo.save(articuloUltimo);

      console.log(`✅ Asignación creada:`);
      console.log(`   📄 Artículo: "${articuloUltimo.titulo}" (ID: ${articuloUltimo.id})`);
      console.log(`   👤 Revisor: ${revisor.email}`);
      console.log(`   📅 Fecha límite: ${asignacion.fecha_limite.toLocaleDateString()}`);
    }
  }

  console.log('\n🎉 Seed completado.');
  console.log('\n📋 Resumen de usuarios de prueba:');
  console.log('──────────────────────────────────────────────────────────');
  for (const u of SEED_USERS) {
    console.log(`  Rol: ${u.rol.padEnd(8)} | Email: ${u.email.padEnd(25)} | ID: ${u.id}`);
  }
  console.log('──────────────────────────────────────────────────────────');
  console.log('  Contraseña de todos: password123\n');

  await AppDataSource.destroy();
}

runSeed().catch((err) => {
  console.error('❌ Error en el seed:', err);
  process.exit(1);
});