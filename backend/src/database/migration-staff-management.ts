import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(__dirname, '../../.env') });

const AppDataSource = new DataSource({
  type: 'mysql',
  url:
    process.env.MARIADB_URI ||
    'mysql://dbuser:dbpassword@localhost:3307/peer_review_db',
  synchronize: false,
  logging: true,
});
// @ts-ignore - Archivo de migración no utilizado actualmente
// import { AppDataSource } from '../data-source';
// import { v4 as uuidv4 } from 'uuid';

/**
 * Migration: Add Staff Management System with Tags
 *
 * This migration:
 * 1. Creates the 'revisor_tags' table to map reviewers to their specialties/tags within a congress
 * 2. Creates the 'congreso_tags' table to map congress-related topics/tags
 * 3. Updates relationships between entities
 *
 * NOTA: Este archivo está deshabilitado temporalmente debido a que data-source no existe.
 * Para habilitar, descomentar los imports y el código de la migración.
 */

/*
// @ts-ignore - Función de migración no utilizada actualmente
async function runMigration() {
  console.log('🌱 Iniciando migración de Sistema de Gestión de Staff...');
  // await AppDataSource.initialize();
  console.log('✅ Conectado a la base de datos.\n');

  // const queryRunner = AppDataSource.createQueryRunner();
  // await queryRunner.connect();

  try {
    console.log('📋 Creando tabla: revisor_tags');
    // await queryRunner.query(`
    //   CREATE TABLE IF NOT EXISTS revisor_tags (
    //     id VARCHAR(36) NOT NULL PRIMARY KEY,
    //     user_id VARCHAR(36) NOT NULL,
    //     tag_id VARCHAR(36) NOT NULL,
    //     congreso_id VARCHAR(36) NOT NULL,
    //     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    //     FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    //     FOREIGN KEY (congreso_id) REFERENCES congresos(id) ON DELETE CASCADE,
    //     UNIQUE KEY unique_revisor_tag (user_id, tag_id, congreso_id)
    //   );
    // `);
    // console.log('✅ Tabla revisor_tags creada correctamente.\n');

    // console.log('📋 Creando tabla: congreso_tags');
    // await queryRunner.query(`
    //   CREATE TABLE IF NOT EXISTS congreso_tags (
    //     id VARCHAR(36) NOT NULL PRIMARY KEY,
    //     congreso_id VARCHAR(36) NOT NULL,
    //     tag_id VARCHAR(36) NOT NULL,
    //     FOREIGN KEY (congreso_id) REFERENCES congresos(id) ON DELETE CASCADE,
    //     FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    //     UNIQUE KEY unique_congreso_tag (congreso_id, tag_id)
    //   );
    // `);
    // console.log('✅ Tabla congreso_tags creada correctamente.\n');

    // // Verify tables were created
    // const revisorTagsExists = await queryRunner.query(`
    //   SELECT * FROM information_schema.TABLES
    //   WHERE TABLE_SCHEMA = DATABASE()
    //   AND TABLE_NAME = 'revisor_tags'
    // `);

    // const congresoTagsExists = await queryRunner.query(`
    //   SELECT * FROM information_schema.TABLES
    //   WHERE TABLE_SCHEMA = DATABASE()
    //   AND TABLE_NAME = 'congreso_tags'
    // `);

    // if (revisorTagsExists.length > 0) {
    //   console.log('✅ Verificación: tabla revisor_tags existe');
    // }
    // if (congresoTagsExists.length > 0) {
    //   console.log('✅ Verificación: tabla congreso_tags existe');
    // }

    // console.log('\n✅ Migración completada exitosamente.');
    // console.log('\n📝 Resumen de cambios:');
    // console.log('   - Nueva tabla: revisor_tags (mapea revisores a etiquetas por congreso)');
    // console.log('   - Nueva tabla: congreso_tags (mapea congresos a etiquetas de temas)');
    // console.log('\n💡 El sistema ahora valida que:');
    // console.log('   1. Los revisores solo pueden asignarse a artículos si sus etiquetas coinciden');
    // console.log('   2. Los editores solo pueden asignarse a congresos si sus etiquetas coinciden');
    // console.log('   3. Los artículos y congresos pueden tener múltiples etiquetas de temas');

  // } catch (error) {
  //   console.error('❌ Error durante la migración:', error);
  //   throw error;
  // } finally {
  //   await queryRunner.release();
  //   await AppDataSource.destroy();
  // }
}

// runMigration().catch(err => {
//   console.error('Migration failed:', err);
//   process.exit(1);
// });
*/
