import { DataSource } from 'typeorm';
import { User, Rol } from '../users/entities/user.entity';
import { Perfil } from '../users/entities/perfil.entity';
import { Articulo } from '../articulos/entities/articulo.entity';
import { Asignacion } from '../asignaciones/entities/asignacion.entity';

/**
 * MIGRACIÓN: Creación retroactiva de perfiles para usuarios existentes.
 * Ejecutar con: docker exec peer_review_api npx ts-node src/database/migration-perfiles.ts
 */

const AppDataSource = new DataSource({
  type: 'mariadb',
  url: process.env.MARIADB_URI || 'mysql://dbuser:dbpassword@mariadb:3306/peer_review_db',
  entities: [User, Perfil, Articulo, Asignacion],
  synchronize: false,
});

async function runMigration() {
  console.log('🌱 Conectando a MariaDB para migración de perfiles...');
  await AppDataSource.initialize();
  console.log('✅ Conectado.\n');

  const userRepo = AppDataSource.getRepository(User);
  const perfilRepo = AppDataSource.getRepository(Perfil);

  const users = await userRepo.find({ relations: ['perfil'] });
  console.log(`Buscando usuarios sin perfil (Total encontrados: ${users.length})`);

  let creados = 0;
  let actualizados = 0;

  const defaultData = {
    [Rol.AUTOR]: { carrera: 'Ingeniería de Software', especialidades: ['Desarrollo Web', 'UX/UI'] },
    [Rol.REVISOR]: { carrera: 'Ciencias de la Computación', especialidades: ['Ciberseguridad', 'IA', 'Cloud'] },
    [Rol.EDITOR]: { carrera: 'Gestión Editorial', especialidades: ['Revision de Pares', 'Calidad'] },
    [Rol.ADMIN]: { carrera: 'Arquitectura de Sistemas', especialidades: ['DevOps', 'Seguridad'] },
  };

  for (const user of users) {
    const data = defaultData[user.rol] || { carrera: 'Investigador', especialidades: ['General'] };

    if (!user.perfil) {
      console.log(`[+] Creando perfil para usuario: ${user.email} (${user.id})`);
      
      const nuevoPerfil = perfilRepo.create({
        id: user.id,
        nombre: user.nombre,
        carrera: data.carrera,
        especialidades: data.especialidades,
      });
      
      await perfilRepo.save(nuevoPerfil);
      creados++;
    } else {
      console.log(`[~] Actualizando especialidades para usuario: ${user.email}`);
      user.perfil.carrera = data.carrera;
      user.perfil.especialidades = data.especialidades;
      await perfilRepo.save(user.perfil);
      actualizados++;
    }
  }

  console.log(`\n🎉 Migración completada.`);
  console.log(`   - Perfiles creados: ${creados}`);
  console.log(`   - Perfiles actualizados: ${actualizados}`);
  await AppDataSource.destroy();
}

runMigration().catch((err) => {
  console.error('❌ Error en la migración:', err);
  process.exit(1);
});
