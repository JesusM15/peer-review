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

  for (const user of users) {
    if (!user.perfil) {
      console.log(`[+] Creando perfil para usuario: ${user.email} (${user.id})`);
      
      const nuevoPerfil = perfilRepo.create({
        id: user.id,
        nombre: user.nombre,
        carrera: '',
        especialidades: [],
      });
      
      await perfilRepo.save(nuevoPerfil);
      creados++;
    } else {
      console.log(`[✓] Usuario ya tiene perfil: ${user.email}`);
    }
  }

  console.log(`\n🎉 Migración completada. Perfiles creados: ${creados}`);
  await AppDataSource.destroy();
}

runMigration().catch((err) => {
  console.error('❌ Error en la migración:', err);
  process.exit(1);
});
