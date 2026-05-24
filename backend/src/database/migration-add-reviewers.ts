/**
 * Agrega revisores de prueba y los vincula al primer congreso disponible.
 * Ejecutar: docker exec peer_review_api npx ts-node src/database/migration-add-reviewers.ts
 */
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { User, Rol } from '../users/entities/user.entity';
import { Perfil } from '../users/entities/perfil.entity';

dotenv.config({ path: join(__dirname, '../../.env') });

const AppDataSource = new DataSource({
  type: 'mysql',
  url:
    process.env.MARIADB_URI ||
    'mysql://dbuser:dbpassword@mariadb:3306/peer_review_db',
  entities: [User, Perfil],
  synchronize: false,
});

const nuevosRevisores = [
  {
    email: 'maria.garcia@uni.edu',
    nombre: 'María García',
    especialidades: ['Machine Learning', 'Data Science', 'Python'],
    carrera: 'Ciencia de Datos',
    telefono: '5215551234567',
  },
  {
    email: 'carlos.lopez@uni.edu',
    nombre: 'Carlos López',
    especialidades: ['Blockchain', 'Criptografía', 'Seguridad'],
    carrera: 'Ingeniería en Sistemas',
    telefono: '5215552345678',
  },
  {
    email: 'ana.martinez@uni.edu',
    nombre: 'Ana Martínez',
    especialidades: ['IoT', 'Embedded Systems', 'C++'],
    carrera: 'Ingeniería Electrónica',
    telefono: '5215553456789',
  },
  {
    email: 'pedro.ramirez@uni.edu',
    nombre: 'Pedro Ramírez',
    especialidades: ['Redes', 'Cloud Computing', 'DevOps'],
    carrera: 'Ingeniería en Sistemas',
    telefono: '5215554567890',
  },
  {
    email: 'lucia.fernandez@uni.edu',
    nombre: 'Lucía Fernández',
    especialidades: ['UX', 'Human-Computer Interaction', 'Accesibilidad'],
    carrera: 'Diseño de Interacción',
    telefono: '5215555678901',
  },
  {
    email: 'jorge.herrera@uni.edu',
    nombre: 'Jorge Herrera',
    especialidades: ['Bases de Datos', 'SQL', 'Big Data'],
    carrera: 'Ciencia de Datos',
    telefono: '5215556789012',
  },
];

async function runMigration() {
  console.log('Conectando a MariaDB para agregar revisores...');
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);
  const perfilRepo = AppDataSource.getRepository(Perfil);
  const congresos: Array<{ id: string; nombre: string }> =
    await AppDataSource.query(
      `SELECT id, nombre FROM congresos ORDER BY nombre ASC`,
    );
  const congresoId =
    congresos.find((c) => c.nombre.includes('Fundacional'))?.id ||
    congresos[0]?.id;

  if (!congresoId) {
    console.error('No hay congresos en la base de datos.');
    await AppDataSource.destroy();
    process.exit(1);
  }

  console.log(`Congreso destino: ${congresoId}\n`);
  const hashedPassword = await bcrypt.hash('password123', 10);
  let procesados = 0;

  for (const revisor of nuevosRevisores) {
    try {
      let usuario = await userRepo.findOne({ where: { email: revisor.email } });

      if (!usuario) {
        const id = uuidv4();
        usuario = userRepo.create({
          id,
          email: revisor.email,
          nombre: revisor.nombre,
          password: hashedPassword,
          rol: Rol.REVISOR,
        });
        await userRepo.save(usuario);

        await perfilRepo.save(
          perfilRepo.create({
            id: usuario.id,
            nombre: revisor.nombre,
            carrera: revisor.carrera,
            especialidades: revisor.especialidades,
            telefono: revisor.telefono,
          }),
        );
        console.log(`[+] Creado: ${revisor.nombre}`);
      } else {
        usuario.rol = Rol.REVISOR;
        await userRepo.save(usuario);

        let perfil = await perfilRepo.findOne({ where: { id: usuario.id } });
        if (!perfil) {
          perfil = perfilRepo.create({
            id: usuario.id,
            nombre: revisor.nombre,
            carrera: revisor.carrera,
            especialidades: revisor.especialidades,
            telefono: revisor.telefono,
          });
        } else {
          perfil.nombre = revisor.nombre;
          perfil.carrera = revisor.carrera;
          perfil.especialidades = revisor.especialidades;
          perfil.telefono = revisor.telefono;
        }
        await perfilRepo.save(perfil);
        console.log(`[~] Actualizado: ${revisor.nombre}`);
      }

      const membresia: Array<{ id: string }> = await AppDataSource.query(
        `SELECT id FROM usuario_congreso_rol
         WHERE user_id = ? AND congreso_id = ? AND rol = 'Revisor' LIMIT 1`,
        [usuario.id, congresoId],
      );

      if (membresia.length === 0) {
        await AppDataSource.query(
          `INSERT INTO usuario_congreso_rol (id, user_id, congreso_id, rol)
           VALUES (?, ?, ?, 'Revisor')`,
          [uuidv4(), usuario.id, congresoId],
        );
        console.log(`    Membresía en congreso agregada`);
      }

      procesados++;
    } catch (error) {
      console.error(`[x] Error con ${revisor.email}:`, error);
    }
  }

  const totalRevisores = await userRepo.count({ where: { rol: Rol.REVISOR } });
  console.log(`\nListo. Revisores procesados: ${procesados}`);
  console.log(`Total revisores en el sistema: ${totalRevisores}`);
  await AppDataSource.destroy();
}

runMigration().catch((err) => {
  console.error('Error en la migración:', err);
  process.exit(1);
});
