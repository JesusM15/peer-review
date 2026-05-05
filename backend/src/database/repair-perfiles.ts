import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Perfil } from '../users/entities/perfil.entity';
import { Articulo } from '../articulos/entities/articulo.entity';
import { Asignacion } from '../asignaciones/entities/asignacion.entity';
import { Congreso } from '../congresos/entities/congreso.entity';
import { Tag } from '../congresos/entities/tag.entity';
import { UsuarioCongresoRol } from '../congresos/entities/usuario-congreso-rol.entity';
import { EditorTag } from '../congresos/entities/editor-tag.entity';

const AppDataSource = new DataSource({
  type: 'mariadb',
  url: process.env.MARIADB_URI || 'mysql://dbuser:dbpassword@peer_review_mariadb:3306/peer_review_db',
  entities: [User, Perfil, Articulo, Asignacion, Congreso, Tag, UsuarioCongresoRol, EditorTag],
  synchronize: false,
});

async function repair() {
  console.log('🔧 Iniciando reparación de tabla perfiles...');
  try {
    await AppDataSource.initialize();
    console.log('✅ Conexión establecida.');
  } catch (err) {
    console.error('❌ Error de conexión:', err);
    process.exit(1);
  }

  const queryRunner = AppDataSource.createQueryRunner();

  try {
    // 1. Eliminar tabla corrupta (sin PK)
    console.log('🗑️ Eliminando tabla perfiles actual...');
    await queryRunner.query('DROP TABLE IF EXISTS perfiles');

    // 2. Crear tabla correctamente con id como PK y FK
    console.log('🏗️ Creando tabla perfiles con estructura correcta...');
    await queryRunner.query(`
      CREATE TABLE perfiles (
        id varchar(255) NOT NULL PRIMARY KEY,
        nombre varchar(255) NOT NULL,
        carrera varchar(255) NOT NULL,
        especialidades text NOT NULL,
        telefono varchar(255) DEFAULT NULL,
        CONSTRAINT FK_perfiles_users FOREIGN KEY (id) REFERENCES users (id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    // 3. Poblar perfiles para todos los usuarios existentes
    console.log('👥 Generando perfiles para usuarios existentes...');
    const userRepo = AppDataSource.getRepository(User);
    const users = await userRepo.find();
    
    for (const user of users) {
      console.log(`[+] Creando perfil para: ${user.nombre}`);
      await queryRunner.query(
        "INSERT INTO perfiles (id, nombre, carrera, especialidades) VALUES (?, ?, ?, ?)",
        [user.id, user.nombre, 'Ingeniería', 'General']
      );
    }

    console.log('✅ Reparación completada exitosamente.');
  } catch (error) {
    console.error('❌ Error durante la reparación:', error);
  } finally {
    await AppDataSource.destroy();
    process.exit(0);
  }
}

repair();
