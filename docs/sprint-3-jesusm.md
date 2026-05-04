# Documentación de Cambios - Sprint 3 (Arquitectura Desacoplada)

**Autor:** JesusM15
**Fecha:** 2026-05-03

## 1. Resumen de la Nueva Arquitectura
Se ha realizado una reestructuración profunda del sistema de roles y pertenencia. El rol de un usuario ya no es una propiedad estática (excepto el Admin global), sino que se define en el contexto de un **Congreso**.

### Triada de Identidad
La identidad de un usuario se define ahora por: `(Usuario, Rol, Congreso)`.

## 2. Cambios en la Base de Datos

### Nuevas Tablas
- **`congresos`**: Almacena los eventos (Congresos).
- **`tags`**: Categorías o especialidades vinculadas a un congreso.
- **`usuario_congreso_rol`**: Tabla intermedia que define qué rol tiene un usuario en un congreso específico.
- **`editor_tags`**: Vincula a los Editores de Sección con Tags específicos dentro de un congreso.

### Modificaciones en Tablas Existentes
- **`users`**: Se mantiene el campo `rol` pero con una semántica de "Rol Global". Solo el valor `Admin` tiene efecto en todo el sistema. Otros roles deben consultarse en `usuario_congreso_rol`.
- **`articulos`**: Se añadió el campo `congreso_id` para segmentar los artículos por evento.

## 3. Lógica de Negocio (Backend)

### Validaciones de Asignación ("El Guardián")
Se han implementado las siguientes restricciones estrictas:
- **Límite Inhumano**: Un revisor no puede tener más de **3 revisiones activas** en total (sumando todos los congresos).
- **Máximo de Revisores**: Cada artículo puede tener un máximo de **3 revisores** asignados.
- **Conflicto de Interés**: Un autor no puede ser revisor de su propio artículo.

### Jerarquía Editorial
Los Editores Jefe tienen control total del congreso. Los Editores de Sección son asignados a Tags específicos para segmentar su trabajo.

## 4. Pasos para la Migración

Para aplicar estos cambios en un entorno existente, siga estos pasos:

1. Asegúrese de que el backend esté compilado.
2. Ejecute el script de migración para crear el congreso por defecto y migrar los datos actuales:
   ```bash
   # Dentro del contenedor del backend o en local
   npx ts-node src/database/migration-sprint-3.ts
   ```
3. El script realizará lo siguiente:
   - Creará el "Congreso Fundacional 2026".
   - Asignará a todos los usuarios existentes su rol actual dentro de ese congreso.
   - Vinculará todos los artículos existentes al congreso fundacional.

## 5. Cambios en la UI (Frontend)
- Se ha implementado un **Selector de Contexto** para elegir el congreso activo.
- El Dashboard ahora filtra la información y los permisos basados en el rol del usuario en el congreso seleccionado.
