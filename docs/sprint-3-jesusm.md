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
4. **Reparar tabla de perfiles (si es necesario):**
   Si encuentra errores de `Unknown column 'perfil.id'`, ejecute:
   ```bash
   docker exec peer_review_api npx ts-node src/database/repair-perfiles.ts
   ```

## 5. Cambios en la UI (Frontend)
- Se ha implementado un **Selector de Contexto** para elegir el congreso activo.
## 6. Hotfixes y Estabilización (Post-Migración)

Tras la implementación inicial, se detectaron y corrigieron los siguientes puntos críticos para asegurar la integridad de la arquitectura:

### Vinculación Automática de Artículos
- **Problema:** Los artículos se estaban creando sin `congreso_id`, quedando "huérfanos" y ocultos para los editores.
- **Corrección:** Se actualizó `AuthorView.vue` y `ReviewerView.vue` para incluir el contexto del congreso activo en la subida de archivos (Multipart/FormData).
- **Backend:** Se habilitó el campo `congreso_id` en `CreateArticuloDto` para permitir que el servidor procese y guarde esta relación.

### Reparación del Esquema de Perfiles
- **Problema:** Error SQL `Unknown column 'perfil.id'` debido a un desajuste en la tabla `perfiles` que carecía de Primary Key.
- **Corrección:** Se creó el script `repair-perfiles.ts` que reconstruye la tabla con la estructura correcta (1:1 compartiendo ID con `users`) y migra los datos existentes.

### Mejoras de UX y Consistencia
- **Sidebar Contextual:** Se eliminó el selector intrusivo por un indicador de texto minimalista con estilo verde esmeralda que indica el congreso activo.
- **Rutas de API:** Se corrigió la URL base en el panel de Editor para incluir el prefijo `/api`, permitiendo la carga correcta de datos desde el backend.
- **Navegación:** Se implementó la opción "Cambiar de Congreso" en el menú de usuario para permitir el cambio de contexto sin cerrar sesión.
