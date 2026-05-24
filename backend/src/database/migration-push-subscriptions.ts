/**
 * Crea tabla push_subscriptions para Web Push.
 * Ejecutar: docker exec peer_review_api npx ts-node src/database/migration-push-subscriptions.ts
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
  await AppDataSource.query(`
    CREATE TABLE IF NOT EXISTS push_subscriptions (
      id VARCHAR(36) NOT NULL PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      endpoint TEXT NOT NULL,
      p256dh VARCHAR(255) NOT NULL,
      auth VARCHAR(255) NOT NULL,
      fecha_creacion DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      UNIQUE KEY unique_push_endpoint (endpoint(500)),
      INDEX idx_push_user (user_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
  await AppDataSource.destroy();
  console.log('Tabla push_subscriptions lista.');
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
