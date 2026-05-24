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

    console.log('Verificando columna tags en solicitudes_congreso...');
    const columns = await queryRunner.query(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'solicitudes_congreso'
        AND COLUMN_NAME = 'tags';
    `);

    if (columns.length === 0) {
      console.log('Agregando columna tags a solicitudes_congreso...');
      await queryRunner.query(`
        ALTER TABLE solicitudes_congreso
        ADD COLUMN tags TEXT NULL AFTER motivo;
      `);
      console.log('Columna tags agregada.');
    } else {
      console.log('La columna tags ya existe.');
    }

    await AppDataSource.destroy();
    console.log('Migración finalizada.');
  } catch (error) {
    console.error('ERROR:');
    console.error(error);
    process.exit(1);
  }
}

void migrate();
