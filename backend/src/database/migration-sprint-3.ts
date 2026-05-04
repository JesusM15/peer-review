import { DataSource } from 'typeorm';
import { User, Rol } from '../users/entities/user.entity';
import { Perfil } from '../users/entities/perfil.entity';
import { Congreso } from '../congresos/entities/congreso.entity';
import { Tag } from '../congresos/entities/tag.entity';
import { UsuarioCongresoRol } from '../congresos/entities/usuario-congreso-rol.entity';
import { EditorTag } from '../congresos/entities/editor-tag.entity';
import { Articulo } from '../articulos/entities/articulo.entity';
import { Asignacion } from '../asignaciones/entities/asignacion.entity';
import { v4 as uuidv4 } from 'uuid';

/**
 * MIGRACIÓN SPRINT 3: 
 * 1. Crear manualmente las nuevas tablas para evitar conflictos de sincronización.
 * 2. Crear un Congreso por defecto.
 * 3. Migrar usuarios existentes al Congreso por defecto manteniendo sus roles.
 * 4. Vincular artículos existentes al Congreso por defecto.
 */

const AppDataSource = new DataSource({
  type: 'mariadb',
  url: process.env.MARIADB_URI || 'mysql://dbuser:dbpassword@localhost:3307/peer_review_db',
  entities: [User, Perfil, Congreso, Tag, UsuarioCongresoRol, EditorTag, Articulo, Asignacion],
  synchronize: false, // Desactivamos sync para evitar que TypeORM intente alterar tablas existentes con datos
});

async function runMigration() {
  console.log('🚀 Iniciando migración Sprint 3...');
  await AppDataSource.initialize();
  console.log('✅ Conexión establecida.\n');

  const queryRunner = AppDataSource.createQueryRunner();

  try {
    console.log('🛠️ Creando nuevas tablas si no existen...');

    // 1. Crear Tabla Congresos
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`congresos\` (
        \`id\` varchar(36) NOT NULL PRIMARY KEY,
        \`nombre\` varchar(255) NOT NULL,
        \`descripcion\` text DEFAULT NULL,
        \`fecha_inicio\` date DEFAULT NULL,
        \`fecha_fin\` date DEFAULT NULL
      ) ENGINE=InnoDB;
    `);

    // 2. Crear Tabla Tags
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`tags\` (
        \`id\` varchar(36) NOT NULL PRIMARY KEY,
        \`nombre\` varchar(255) NOT NULL,
        \`congreso_id\` varchar(36) NOT NULL,
        CONSTRAINT \`FK_tags_congresos\` FOREIGN KEY (\`congreso_id\`) REFERENCES \`congresos\` (\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    // 3. Crear Tabla Usuario_Congreso_Rol
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`usuario_congreso_rol\` (
        \`id\` varchar(36) NOT NULL PRIMARY KEY,
        \`user_id\` varchar(36) NOT NULL,
        \`congreso_id\` varchar(36) NOT NULL,
        \`rol\` enum('Autor','Revisor','Editor','Admin') NOT NULL,
        CONSTRAINT \`FK_ucr_users\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_ucr_congresos\` FOREIGN KEY (\`congreso_id\`) REFERENCES \`congresos\` (\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    // 4. Crear Tabla Editor_Tags
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`editor_tags\` (
        \`id\` varchar(36) NOT NULL PRIMARY KEY,
        \`user_id\` varchar(36) NOT NULL,
        \`tag_id\` varchar(36) NOT NULL,
        \`congreso_id\` varchar(36) NOT NULL,
        CONSTRAINT \`FK_et_users\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_et_tags\` FOREIGN KEY (\`tag_id\`) REFERENCES \`tags\` (\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_et_congresos\` FOREIGN KEY (\`congreso_id\`) REFERENCES \`congresos\` (\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    // 5. Agregar congreso_id a articulos si no existe
    const tableArticulos = await queryRunner.getTable('articulos');
    if (tableArticulos && !tableArticulos.columns.find(c => c.name === 'congreso_id')) {
      console.log('➕ Agregando columna congreso_id a la tabla articulos...');
      await queryRunner.query(`
        ALTER TABLE \`articulos\` 
        ADD COLUMN \`congreso_id\` varchar(36) DEFAULT NULL,
        ADD CONSTRAINT \`FK_articulos_congreso\` FOREIGN KEY (\`congreso_id\`) REFERENCES \`congresos\` (\`id\`)
      `);
    }

    console.log('✅ Tablas y columnas preparadas.');

    // --- Lógica de Negocio de Migración ---
    const userRepo = AppDataSource.getRepository(User);
    const congresoRepo = AppDataSource.getRepository(Congreso);
    const ucrRepo = AppDataSource.getRepository(UsuarioCongresoRol);
    const articuloRepo = AppDataSource.getRepository(Articulo);

    // 1. Crear Congreso por defecto si no hay ninguno
    let defaultCongreso = await congresoRepo.findOne({ where: { nombre: 'Congreso Fundacional 2026' } });
    if (!defaultCongreso) {
      console.log('🏠 Creando Congreso por defecto...');
      defaultCongreso = congresoRepo.create({
        id: uuidv4(),
        nombre: 'Congreso Fundacional 2026',
        descripcion: 'Congreso inicial para migración de datos.',
        fecha_inicio: new Date('2026-01-01'),
        fecha_fin: new Date('2026-12-31'),
      });
      await congresoRepo.save(defaultCongreso);
      console.log(`✅ Congreso creado: ${defaultCongreso.nombre}`);
    }

    // 2. Migrar Usuarios
    const users = await userRepo.find();
    console.log(`👥 Migrando roles de ${users.length} usuarios al congreso...`);
    let userCount = 0;
    for (const user of users) {
      const existingUCR = await ucrRepo.findOne({ where: { user_id: user.id, congreso_id: defaultCongreso.id } });
      if (!existingUCR) {
        const ucr = ucrRepo.create({
          id: uuidv4(),
          user_id: user.id,
          congreso_id: defaultCongreso.id,
          rol: user.rol,
        });
        await ucrRepo.save(ucr);
        userCount++;
      }
    }
    console.log(`✅ ${userCount} membresías creadas.`);

    // 3. Migrar Artículos
    const articulos = await articuloRepo.find();
    console.log(`📄 Vinculando ${articulos.length} artículos al congreso...`);
    let artCount = 0;
    for (const articulo of articulos) {
      if (!articulo.congreso_id) {
        articulo.congreso_id = defaultCongreso.id;
        await articuloRepo.save(articulo);
        artCount++;
      }
    }
    console.log(`✅ ${artCount} artículos actualizados.`);

    console.log('\n🎉 Migración Sprint 3 finalizada con éxito.');

  } catch (error) {
    console.error('❌ Error fatal en migración Sprint 3:', error);
    process.exit(1);
  } finally {
    await queryRunner.release();
    await AppDataSource.destroy();
  }
}

runMigration().catch((err) => {
  console.error('❌ Error no capturado:', err);
  process.exit(1);
});
