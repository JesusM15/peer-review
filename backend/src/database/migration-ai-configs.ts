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

/**
 * Migration: Crear tabla ai_configs
 *
 * Crea la tabla que respalda la entidad AIConfig del módulo de IA.
 * El proyecto corre con `synchronize: false`, así que cada entidad
 * necesita su migración propia.
 */
async function runMigration() {
  console.log('🌱 Iniciando migración de ai_configs...');
  await AppDataSource.initialize();
  console.log('✅ Conectado a la base de datos.\n');

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    console.log('📋 Creando tabla: ai_configs');
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS ai_configs (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        provider VARCHAR(50) NOT NULL DEFAULT 'Gemini',
        apiKey TEXT NULL,
        modelName VARCHAR(100) NOT NULL DEFAULT 'gemini-1.5-flash',
        baseUrl TEXT NULL,
        temperature FLOAT NOT NULL DEFAULT 0.7,
        maxTokens INT NOT NULL DEFAULT 2048,
        isActive BOOLEAN NOT NULL DEFAULT TRUE,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabla ai_configs creada correctamente.\n');

    const exists = await queryRunner.query(`
      SELECT * FROM information_schema.TABLES
      WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'ai_configs'
    `);

    if (exists.length > 0) {
      console.log('✅ Verificación: tabla ai_configs existe');
    }

    console.log('\n✅ Migración completada exitosamente.');
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    throw error;
  } finally {
    await queryRunner.release();
    await AppDataSource.destroy();
  }
}

runMigration().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
