-- Script SQL para agregar 3 revisores adicionales para pruebas de IA
-- Ejecutar directamente en MariaDB con: mysql -u root -p -P 3307 peer_review_db < add-reviewers.sql

USE peer_review_db;

-- María García - Machine Learning, Data Science, Python
INSERT INTO users (id, email, nombre, password, rol) 
VALUES (
  UUID(),
  'maria.garcia@uni.edu',
  'María García',
  '$2b$10$YourHashedPasswordHere', -- Reemplazar con hash real de 'password123'
  'Revisor'
) ON DUPLICATE KEY UPDATE rol = 'Revisor', nombre = 'María García';

-- Carlos López - Blockchain, Criptografía, Seguridad
INSERT INTO users (id, email, nombre, password, rol) 
VALUES (
  UUID(),
  'carlos.lopez@uni.edu',
  'Carlos López',
  '$2b$10$YourHashedPasswordHere', -- Reemplazar con hash real de 'password123'
  'Revisor'
) ON DUPLICATE KEY UPDATE rol = 'Revisor', nombre = 'Carlos López';

-- Ana Martínez - IoT, Embedded Systems, C++
INSERT INTO users (id, email, nombre, password, rol) 
VALUES (
  UUID(),
  'ana.martinez@uni.edu',
  'Ana Martínez',
  '$2b$10$YourHashedPasswordHere', -- Reemplazar con hash real de 'password123'
  'Revisor'
) ON DUPLICATE KEY UPDATE rol = 'Revisor', nombre = 'Ana Martínez';

-- Crear/actualizar perfiles
INSERT INTO perfiles (id, nombre, carrera, especialidades, telefono)
SELECT u.id, u.nombre, 
  CASE u.email
    WHEN 'maria.garcia@uni.edu' THEN 'Ciencia de Datos'
    WHEN 'carlos.lopez@uni.edu' THEN 'Ingeniería en Sistemas'
    WHEN 'ana.martinez@uni.edu' THEN 'Ingeniería Electrónica'
  END as carrera,
  CASE u.email
    WHEN 'maria.garcia@uni.edu' THEN 'Machine Learning,Data Science,Python'
    WHEN 'carlos.lopez@uni.edu' THEN 'Blockchain,Criptografía,Seguridad'
    WHEN 'ana.martinez@uni.edu' THEN 'IoT,Embedded Systems,C++'
  END as especialidades,
  CASE u.email
    WHEN 'maria.garcia@uni.edu' THEN '5215551234567'
    WHEN 'carlos.lopez@uni.edu' THEN '5215552345678'
    WHEN 'ana.martinez@uni.edu' THEN '5215553456789'
  END as telefono
FROM users u
WHERE u.email IN ('maria.garcia@uni.edu', 'carlos.lopez@uni.edu', 'ana.martinez@uni.edu')
ON DUPLICATE KEY UPDATE 
  nombre = VALUES(nombre),
  carrera = VALUES(carrera),
  especialidades = VALUES(especialidades),
  telefono = VALUES(telefono);
