import { DataSource } from 'typeorm';
import { User, Rol } from '../users/entities/user.entity';
import { Perfil } from '../users/entities/perfil.entity';

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
  entities: [User, Perfil],
  synchronize: false,
});

const SEED_USERS = [
  {
    id: '11111111-1111-4111-a111-111111111111',
    email: 'autor@diego.edu',
    password: 'password123',
    rol: Rol.AUTOR,
    nombre: 'Ana García',
    carrera: 'Ingeniería de Software',
    especialidades: ['Machine Learning', 'Bases de Datos'],
  },
  {
    id: '22222222-2222-4222-a222-222222222222',
    email: 'revisor@diego.edu',
    password: 'password123',
    rol: Rol.REVISOR,
    nombre: 'Carlos Martínez',
    carrera: 'Ciencias de la Computación',
    especialidades: ['Algoritmos', 'Seguridad Informática'],
  },
  {
    id: '33333333-3333-4333-a333-333333333333',
    email: 'editor@diego.edu',
    password: 'password123',
    rol: Rol.EDITOR,
    nombre: 'Laura Torres',
    carrera: 'Sistemas de Información',
    especialidades: ['Gestión Editorial', 'Investigación Académica'],
  },
];

async function runSeed() {
  console.log('🌱 Conectando a MariaDB...');
  await AppDataSource.initialize();
  console.log('✅ Conectado.\n');

  const userRepo = AppDataSource.getRepository(User);
  const perfilRepo = AppDataSource.getRepository(Perfil);

  for (const seed of SEED_USERS) {
    const existingUser = await userRepo.findOne({ where: { id: seed.id } });

    if (existingUser) {
      console.log(`⚠️  Usuario "${seed.email}" ya existe. Saltando...`);
      continue;
    }

    const user = userRepo.create({
      id: seed.id,
      email: seed.email,
      password: seed.password,
      rol: seed.rol,
    });
    await userRepo.save(user);

    const perfil = perfilRepo.create({
      id: seed.id, // mismo UUID que User
      nombre: seed.nombre,
      carrera: seed.carrera,
      especialidades: seed.especialidades,
    });
    await perfilRepo.save(perfil);

    console.log(`✅ Usuario creado: ${seed.email} [${seed.rol}] — ID: ${seed.id}`);
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
