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
    console.log(
      '📦 Conectado a la base de datos para la migración del rol de Editor Jefe...',
    );

    const queryRunner = AppDataSource.createQueryRunner();

    console.log(
      '🚀 Modificando columna rol en la tabla "users" a VARCHAR(50)...',
    );
    await queryRunner.query(`
      ALTER TABLE \`users\` MODIFY COLUMN \`rol\` VARCHAR(50) NOT NULL DEFAULT 'Autor';
    `);

    console.log(
      '🚀 Modificando columna rol en la tabla "usuario_congreso_rol" a VARCHAR(50)...',
    );
    await queryRunner.query(`
      ALTER TABLE \`usuario_congreso_rol\` MODIFY COLUMN \`rol\` VARCHAR(50) NOT NULL;
    `);

    console.log(
      '✅ Columnas modificadas a VARCHAR(50) exitosamente. Ahora soportan "Editor Jefe".',
    );

    await AppDataSource.destroy();
    console.log('👋 Migración de roles finalizada exitosamente.');
  } catch (error) {
    console.error(
      '❌ Error durante la migración del rol de Editor Jefe:',
      error,
    );
    process.exit(1);
  }
}

migrate();
