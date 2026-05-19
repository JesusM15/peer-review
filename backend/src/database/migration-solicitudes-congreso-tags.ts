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

async function migrate() {
  try {
    await AppDataSource.initialize();
    console.log('Conectado a la base de datos...');

    const queryRunner = AppDataSource.createQueryRunner();

    console.log('Agregando columna tags a solicitudes_congreso...');
    await queryRunner.query(`
      ALTER TABLE solicitudes_congreso
      ADD COLUMN IF NOT EXISTS tags TEXT NULL;
    `);
    console.log('Columna tags agregada.');

    await AppDataSource.destroy();
    console.log('Migración finalizada.');
  } catch (error) {
    console.error('ERROR:');
    console.error(error);
    process.exit(1);
  }
}

void migrate();
