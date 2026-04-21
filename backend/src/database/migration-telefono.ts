import { DataSource } from 'typeorm';

/**
 * MIGRACIÓN: Agregar columna telefono a la tabla perfiles.
 * Ejecutar con: docker exec peer_review_api npx ts-node src/database/migration-telefono.ts
 */

const AppDataSource = new DataSource({
  type: 'mariadb',
  url: process.env.MARIADB_URI || 'mysql://dbuser:dbpassword@mariadb:3306/peer_review_db',
  entities: [],
  synchronize: false,
});

async function runMigration() {
  console.log('🌱 Conectando a MariaDB para agregar columna telefono...');
  await AppDataSource.initialize();
  console.log('✅ Conectado.\n');

  const queryRunner = AppDataSource.createQueryRunner();

  try {
    // Verificar si la columna ya existe
    const tableInfo = await queryRunner.getTable('perfiles');
    const telefonoColumnExists = tableInfo?.columns.find(column => column.name === 'telefono');

    if (!telefonoColumnExists) {
      console.log('[+] Agregando columna telefono a la tabla perfiles...');
      
      // Agregar la columna telefono
      await queryRunner.query(`
        ALTER TABLE perfiles 
        ADD COLUMN telefono VARCHAR(20) NULL
      `);
      
      console.log('✅ Columna telefono agregada exitosamente.');
    } else {
      console.log('ℹ️  La columna telefono ya existe en la tabla perfiles.');
    }

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    throw error;
  } finally {
    await queryRunner.release();
    await AppDataSource.destroy();
  }
}

runMigration().catch((err) => {
  console.error('❌ Error en la migración:', err);
  process.exit(1);
});
