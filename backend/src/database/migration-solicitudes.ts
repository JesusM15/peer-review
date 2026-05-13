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
    console.log('📦 Conectado a la base de datos...');

    const queryRunner = AppDataSource.createQueryRunner();

    console.log('🚀 Creando tabla solicitudes_rol (versión simplificada)...');
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS solicitudes_rol (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        congreso_id VARCHAR(36) NOT NULL,
        rol_solicitado VARCHAR(50) NOT NULL,
        estado VARCHAR(50) NOT NULL DEFAULT 'Pendiente',
        motivo_usuario TEXT,
        respuesta_admin TEXT,
        fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        fecha_resolucion TIMESTAMP NULL
      ) ENGINE=InnoDB;
    `);

    console.log('✅ Tabla solicitudes_rol creada.');
    
    await AppDataSource.destroy();
    console.log('👋 Fin.');
  } catch (error) {
    console.error('❌ ERROR:');
    console.error(error);
    process.exit(1);
  }
}

migrate();
