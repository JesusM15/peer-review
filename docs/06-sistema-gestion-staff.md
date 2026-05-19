# Sistema de Gestión de Staff con Etiquetas de Especialidad

## 📋 Descripción General

Se ha implementado un sistema completo de gestión de staff que permite:

1. **Asignar etiquetas (especialidades) a revisores** dentro de un congreso específico
2. **Asignar etiquetas (temas) a artículos** para indicar sus áreas de investigación
3. **Asignar etiquetas (temas) a congresos** para especificar sus áreas de interés
4. **Validar automáticamente** que los revisores y editores solo puedan ser asignados si cumplen con al menos una etiqueta coincidente

---

## 🗂️ Estructura de Entidades

### Nuevas Entidades Creadas

#### 1. **RevisorTag** (`revisor_tags`)
- Mapea revisores a sus etiquetas de especialidad dentro de un congreso
- **Campos:**
  - `id`: UUID (Primary Key)
  - `user_id`: ID del usuario revisor
  - `tag_id`: ID de la etiqueta/especialidad
  - `congreso_id`: ID del congreso
- **Restricción Única:** (user_id, tag_id, congreso_id)

#### 2. **CongresoTag** (`congreso_tags`)
- Mapea congresos a sus etiquetas de temas/áreas de interés
- **Campos:**
  - `id`: UUID (Primary Key)
  - `congreso_id`: ID del congreso
  - `tag_id`: ID de la etiqueta
- **Restricción Única:** (congreso_id, tag_id)

### Entidades Existentes Relacionadas

- **ArticuloTag**: Mapea artículos a sus etiquetas de temas
- **EditorTag**: Mapea editores a sus etiquetas de especialidad en congresos
- **Tag**: Etiqueta general del sistema
- **Articulo**: Artículos con referencia a congreso
- **Congreso**: Congresos del sistema
- **User**: Usuarios del sistema (revisores, editores, autores, etc.)

---

## 🔌 Cambios en Módulos

### CongresosModule
**Nuevos Imports:**
```typescript
import { RevisorTag } from './entities/revisor-tag.entity';
import { CongresoTag } from './entities/congreso-tag.entity';
```

**Nuevos Repositorios:**
- `RevisorTag`
- `CongresoTag`

### AsignacionesModule
**Nuevos Imports:**
```typescript
import { RevisorTag } from '../congresos/entities/revisor-tag.entity';
import { Congreso } from '../congresos/entities/congreso.entity';
```

**Nuevos Repositorios:**
- `RevisorTag`
- `Congreso`

---

## 📡 Nuevos Endpoints de API

### Gestión de Revisores en Congresos

#### 1. Asignar Etiqueta a Revisor en Congreso
```
POST /congresos/:id/assign-revisor
Body: { userId: string; tagId: string }
Response: RevisorTag
```

#### 2. Obtener Etiquetas de un Revisor en Congreso
```
GET /congresos/:id/revisor/:userId/tags
Response: RevisorTag[]
```

#### 3. Remover Etiqueta de Revisor
```
DELETE /congresos/revisor-tag/:revisorTagId
Response: void
```

### Gestión de Congresos

#### 4. Asignar Etiqueta a Congreso
```
POST /congresos/:id/congreso-tags
Body: { tagId: string }
Response: CongresoTag
```

#### 5. Obtener Etiquetas de un Congreso
```
GET /congresos/:id/congreso-tags
Response: CongresoTag[]
```

#### 6. Remover Etiqueta de Congreso
```
DELETE /congresos/congreso-tag/:congresoTagId
Response: void
```

### Validación de Asignaciones

#### 7. Validar si un Revisor puede Asignarse a un Congreso
```
GET /congresos/:id/validate-revisor/:userId
Response: { isValid: boolean; message?: string }
```

#### 8. Validar si un Editor puede Asignarse a un Congreso
```
GET /congresos/:id/validate-editor/:userId
Response: { isValid: boolean; message?: string }
```

### Gestión de Etiquetas en Artículos

#### 9. Asignar Etiqueta a Artículo
```
POST /articulos/:id/tags
Body: { tagId: string }
Response: ArticuloTag
```

#### 10. Obtener Etiquetas de un Artículo
```
GET /articulos/:id/tags
Response: ArticuloTag[]
```

#### 11. Remover Etiqueta de Artículo
```
DELETE /articulos/tags/:tagId
Response: void
```

---

## 🔐 Validaciones Implementadas

### Validación de Asignación de Revisores a Artículos

**Ubicación:** `AsignacionesService.create()`

**Reglas:**
1. ✅ El revisor no puede revisar su propio artículo (conflicto de interés)
2. ✅ **El revisor debe tener al menos una etiqueta que coincida con las del artículo**
   - Primero busca etiquetas RevisorTag en el congreso del artículo
   - Si no encuentra, usa las especialidades del perfil como fallback
3. ✅ Máximo 3 revisores por artículo
4. ✅ Máximo 3 artículos activos por revisor

**Mensaje de Error:**
```
El revisor no tiene especialidades que coincidan con las etiquetas del artículo.
Etiquetas del artículo: [tags]
Especialidades del revisor: [specialties]
```

### Validación de Asignación a Congresos

**Ubicación:** `CongresosService.validateRevisorForCongreso()` y `validateEditorForCongreso()`

**Reglas:**
1. ✅ Si el congreso no tiene etiquetas, cualquier revisor/editor puede ser asignado
2. ✅ Si el congreso tiene etiquetas, el revisor/editor debe tener al menos una que coincida
3. ✅ Si el revisor/editor no tiene etiquetas en el congreso, la validación falla

---

## 📊 Flujo de Uso Típico

### 1. Crear un Congreso con Etiquetas
```javascript
POST /congresos
{
  nombre: "Congreso de IA 2024",
  descripcion: "Conferencia internacional",
  tags: ["Machine Learning", "Deep Learning", "NLP"]
}
```

### 2. Enrolar Revisores en el Congreso
```javascript
POST /congresos/{congresoId}/enroll
{
  userId: "{revisorId}",
  rol: "Revisor"
}
```

### 3. Asignar Etiquetas de Especialidad al Revisor
```javascript
POST /congresos/{congresoId}/assign-revisor
{
  userId: "{revisorId}",
  tagId: "{tagId}" // Por ejemplo, el tag de "Machine Learning"
}
```

### 4. Crear Artículo Asociado al Congreso
```javascript
POST /articulos
{
  id: "{articuloId}",
  titulo: "Aplicaciones de Deep Learning",
  autor_id: "{autorId}",
  congreso_id: "{congresoId}"
}
```

### 5. Asignar Etiquetas al Artículo
```javascript
POST /articulos/{articuloId}/tags
{
  tagId: "{tagId}" // Tag de "Deep Learning"
}
```

### 6. Asignar Revisor al Artículo
```javascript
POST /asignaciones
{
  articulo_id: "{articuloId}",
  revisor_id: "{revisorId}",
  fecha_limite: "2024-12-31"
}
// ✅ La asignación es exitosa porque el revisor tiene el tag "Deep Learning"
```

---

## 🗄️ Migración de Base de Datos

**Archivo:** `migration-staff-management.ts`

**Ejecutar:**
```bash
npm run migrate:staff-management
# o manualmente en el terminal:
cd backend && ts-node src/database/migration-staff-management.ts
```

**Tablas Creadas:**
- `revisor_tags`: Especialidades de revisores por congreso
- `congreso_tags`: Temas/áreas de cada congreso

---

## 📝 Cambios en Servicios

### CongresosService
**Métodos Nuevos:**
- `assignRevisorToTag()` - Asignar etiqueta a revisor
- `getRevisorTags()` - Obtener etiquetas de un revisor
- `removeRevisorTag()` - Remover etiqueta de revisor
- `assignCongresoTag()` - Asignar etiqueta a congreso
- `getCongresoTags()` - Obtener etiquetas del congreso
- `removeCongresoTag()` - Remover etiqueta del congreso
- `validateRevisorForCongreso()` - Validar revisor
- `validateEditorForCongreso()` - Validar editor

### ArticulosService
**Métodos Nuevos:**
- `addTagToArticle()` - Agregar etiqueta a artículo
- `getArticleTags()` - Obtener etiquetas del artículo
- `removeTagFromArticle()` - Remover etiqueta del artículo

### AsignacionesService
**Métodos Actualizados:**
- `create()` - Ahora valida contra RevisorTag primero, luego usa Perfil.especialidades como fallback

---

## 🔄 Compatibilidad Hacia Atrás

El sistema mantiene compatibilidad hacia atrás:
- Si no existen RevisorTags, el sistema usa `Perfil.especialidades`
- Si el artículo no tiene etiquetas, se permite la asignación
- Si el congreso no tiene etiquetas, se permite la asignación

---

## 📌 Notas Importantes

1. **Orden de Prioridad para Especialidades del Revisor:**
   - Primera opción: RevisorTag en el contexto del congreso
   - Segunda opción: Especialidades del Perfil (fallback)

2. **Tags Globales vs Específicos del Congreso:**
   - Los Tags siempre pertenecen a un congreso específico
   - No hay tags globales compartidos entre congresos

3. **Validación Flexible:**
   - Se requiere **AL MENOS UNA** coincidencia de etiqueta
   - No se requieren todas las etiquetas del artículo

---

## 🚀 Próximas Mejoras

- [ ] Interfaz UI para gestionar etiquetas
- [ ] Reportes de especialidades por congreso
- [ ] Sugerencias automáticas de revisores basadas en tags
- [ ] Historial de competencias por revisor
- [ ] Análisis de cobertura de temas

---

## 📞 Contacto y Soporte

Para preguntas o issues relacionados con el sistema de gestión de staff, consultar la documentación técnica o contactar al equipo de desarrollo.
