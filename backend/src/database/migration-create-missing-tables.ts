/**
 * Crea tablas faltantes para tags de artículos y staff (revisor_tags, congreso_tags).
 * Ejecutar: docker exec peer_review_api npx ts-node src/database/migration-create-missing-tables.ts
 */
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(__dirname, '../../.env') });

const AppDataSource = new DataSource({
  type: 'mysql',
  url:
    process.env.MARIADB_URI ||
    'mysql://dbuser:dbpassword@mariadb:3306/peer_review_db',
  synchronize: false,
});

async function migrate() {
  await AppDataSource.initialize();
  const qr = AppDataSource.createQueryRunner();
  await qr.connect();

  console.log('Creando tabla articulo_tags...');
  await qr.query(`
    CREATE TABLE IF NOT EXISTS articulo_tags (
      id VARCHAR(36) NOT NULL PRIMARY KEY,
      articulo_id VARCHAR(36) NOT NULL,
      tag_id VARCHAR(36) NOT NULL,
      FOREIGN KEY (articulo_id) REFERENCES articulos(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
      UNIQUE KEY unique_articulo_tag (articulo_id, tag_id)
    );
  `);

  console.log('Creando tabla revisor_tags...');
  await qr.query(`
    CREATE TABLE IF NOT EXISTS revisor_tags (
      id VARCHAR(36) NOT NULL PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      tag_id VARCHAR(36) NOT NULL,
      congreso_id VARCHAR(36) NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
      FOREIGN KEY (congreso_id) REFERENCES congresos(id) ON DELETE CASCADE,
      UNIQUE KEY unique_revisor_tag (user_id, tag_id, congreso_id)
    );
  `);

  console.log('Creando tabla congreso_tags...');
  await qr.query(`
    CREATE TABLE IF NOT EXISTS congreso_tags (
      id VARCHAR(36) NOT NULL PRIMARY KEY,
      congreso_id VARCHAR(36) NOT NULL,
      tag_id VARCHAR(36) NOT NULL,
      FOREIGN KEY (congreso_id) REFERENCES congresos(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
      UNIQUE KEY unique_congreso_tag (congreso_id, tag_id)
    );
  `);

  await qr.release();
  await AppDataSource.destroy();
  console.log('Migración de tablas completada.');
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
