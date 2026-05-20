import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(__dirname, '../../.env') });

const AppDataSource = new DataSource({
  type: 'mysql',
  url: process.env.MARIADB_URI || 'mysql://dbuser:dbpassword@localhost:3307/peer_review_db',
  synchronize: false,
  logging: true,
});

async function migrate() {
  try {
    await AppDataSource.initialize();
    console.log('📦 Conectado a la base de datos para migración de tags en articulos...');

    const queryRunner = AppDataSource.createQueryRunner();

    console.log('🚀 Agregando columna `tags` a la tabla `articulos` (si no existe)...');
    await queryRunner.query(
      `ALTER TABLE articulos ADD COLUMN IF NOT EXISTS tags TEXT NULL;`
    );

    console.log('✅ Columna `tags` agregada o ya existente.');

    await AppDataSource.destroy();
    console.log('👋 Migración finalizada.');
  } catch (error) {
    console.error('❌ Error durante la migración de tags en articulos:', error);
    process.exit(1);
  }
}

migrate();
