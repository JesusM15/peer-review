# Migración Sprint 4: Soporte para Rol "Editor Jefe"

Este documento detalla los cambios realizados en la base de datos y la justificación técnica de la migración para implementar el rol de **Editor Jefe**.

---

## ¿Por qué fue necesaria la migración?

Originalmente, los roles de usuario a nivel de la plataforma (`users`) y a nivel de los congresos (`usuario_congreso_rol`) se modelaron utilizando el tipo de datos **`ENUM`** de SQL, restringidos a los valores específicos:
*   `'Autor'`
*   `'Revisor'`
*   `'Editor'`
*   `'Admin'`

### El Problema del ENUM en Base de Datos

El tipo `ENUM` en motores relacionales como MariaDB/MySQL es sumamente rígido. Si intentamos guardar un valor de string nuevo que no esté explícitamente en la lista permitida por el esquema (por ejemplo, el nuevo rol de **`'Editor Jefe'`**), el motor de base de datos lanzará un error crítico de restricción de datos, impidiendo guardar o persistir la información.

Para evitar esta rigidez y permitir una gobernanza de roles escalable y ágil, decidimos:
1. **Alterar las columnas de rol de `ENUM` a `VARCHAR(50)`** en ambas tablas.
2. Mantener la validación de enums a nivel de código de aplicación (TypeScript/NestJS) para garantizar la integridad sin comprometer la flexibilidad de almacenamiento del motor.

---

## Cambios Realizados

Se creó y ejecutó el script de migración manual [migration-editor-jefe.ts](file:///c:/Users/GF63/Documents/ingenieriasoftware/proyecto_final/backend/src/database/migration-editor-jefe.ts) que realizó las siguientes operaciones SQL de forma segura sin alterar ni corromper los datos existentes:

```sql
-- 1. Convertir columna de la tabla de usuarios
ALTER TABLE `users` MODIFY COLUMN `rol` VARCHAR(50) NOT NULL DEFAULT 'Autor';

-- 2. Convertir columna de la tabla de membresías del congreso
ALTER TABLE `usuario_congreso_rol` MODIFY COLUMN `rol` VARCHAR(50) NOT NULL;
```

Con este cambio, el sistema ahora soporta de forma nativa e integrada el rol `'Editor Jefe'`, permitiendo asociarlo automáticamente a los creadores de congresos aprobados.
