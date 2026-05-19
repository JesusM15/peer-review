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

    console.log('Creando tabla solicitudes_congreso...');
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS solicitudes_congreso (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        solicitante_id VARCHAR(36) NOT NULL,
        nombre_propuesto VARCHAR(150) NOT NULL,
        descripcion_propuesta TEXT NULL,
        fecha_inicio_propuesta DATE NULL,
        fecha_fin_propuesta DATE NULL,
        motivo TEXT NULL,
        estado VARCHAR(50) NOT NULL DEFAULT 'Pendiente',
        respuesta_admin TEXT NULL,
        congreso_creado_id VARCHAR(36) NULL,
        fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        fecha_resolucion TIMESTAMP NULL,
        INDEX idx_solicitudes_congreso_estado (estado),
        INDEX idx_solicitudes_congreso_solicitante (solicitante_id)
      ) ENGINE=InnoDB;
    `);

    console.log('Tabla solicitudes_congreso creada.');

    console.log('Creando tabla notificaciones...');
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS notificaciones (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        tipo VARCHAR(80) NOT NULL,
        titulo VARCHAR(200) NOT NULL,
        mensaje TEXT NOT NULL,
        link VARCHAR(255) NULL,
        leida TINYINT(1) NOT NULL DEFAULT 0,
        fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_notificaciones_user (user_id),
        INDEX idx_notificaciones_user_leida (user_id, leida)
      ) ENGINE=InnoDB;
    `);

    console.log('Tabla notificaciones creada.');

    await AppDataSource.destroy();
    console.log('Migración finalizada.');
  } catch (error) {
    console.error('ERROR:');
    console.error(error);
    process.exit(1);
  }
}

void migrate();
