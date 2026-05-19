-- Script para crear usuario de prueba en MariaDB
-- Ejecutar en tu base de datos

-- 1. Insertar usuario de prueba
-- Contraseña hasheada: 'password123' -> $2a$10$K8KPh8Qv6PjBZQKdZgFG6eJQIaFqRpQqfQPxv/Hv/.tO3R5hF3gKu
INSERT INTO users (id, nombre, email, password, rol) VALUES (
    UUID(),
    'Usuario Prueba Fix',
    'test_prueba_fix@diego.edu',
    '$2a$10$K8KPh8Qv6PjBZQKdZgFG6eJQIaFqRpQqfQPxv/Hv/.tO3R5hF3gKu',
    'Autor'
);

-- 2. Crear su perfil asociado
INSERT INTO perfil (id, nombre, carrera, especialidades) 
SELECT id, nombre, '', '' FROM users WHERE email = 'test_prueba_fix@diego.edu';

-- Verificar que se creó
SELECT id, nombre, email, rol, password FROM users WHERE email = 'test_prueba_fix@diego.edu';
