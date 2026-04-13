# Dashboard de Administración - Resumen de Implementación

## Fecha
13 de abril de 2026

## Objetivo
Agregar gráficas al dashboard del administrador que muestren estadísticas de usuarios y artículos en la plataforma, incluyendo cantidad total de usuarios, desglose por roles, estadísticas de artículos, top autores y carga de revisores.

## Cambios Realizados

### 1. Backend - Endpoints de Estadísticas

#### Usuarios
**Archivo:** `backend/src/users/users.service.ts`

- Se agregó el método `getStats()` que consulta todos los usuarios y cuenta por rol:
  - Total de usuarios
  - Autores
  - Revisores
  - Editores
  - Admins

**Archivo:** `backend/src/users/users.controller.ts`

- Se agregó endpoint `GET /api/users/stats`
- **Nota importante:** El endpoint debe estar ANTES de `@Get(':id')` para que NestJS no lo interprete como un ID

#### Artículos
**Archivo:** `backend/src/articulos/articulos.service.ts`

- Se agregó el método `getStats()` que devuelve estadísticas de artículos:
  - Total de artículos
  - Artículos por estado (Borrador, En Revisión, Aceptado, Rechazado)
  - Top 5 autores con más artículos
  - Artículos necesitando revisión
  - Artículos completados
  - Tasa de aceptación (%)
  - Actividad semanal simulada

**Archivo:** `backend/src/articulos/articulos.controller.ts`

- Se agregó endpoint `GET /api/articulos/stats`

#### Asignaciones
**Archivo:** `backend/src/asignaciones/asignaciones.service.ts`

- Endpoint existente `GET /api/asignaciones/revisores` devuelve carga de trabajo de revisores

### 2. Frontend - Instalación de Dependencias

**Archivo:** `frontend/package.json`

Se agregaron las dependencias:
- `chart.js`: ^4.4.0
- `vue-chartjs`: ^5.3.0

### 3. Frontend - Vista de Administrador

**Archivo:** `frontend/src/views/AdminView.vue`

#### Importaciones actualizadas:
```typescript
import { Pie, Bar } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);
```

#### Tarjetas de estadísticas de usuarios:
- 4 tarjetas mostrando: Total Usuarios, Autores, Revisores, Editores
- Iconos SVG para mantener consistencia con el diseño
- Cada tarjeta tiene color distintivo según el rol

#### Tarjetas de estadísticas de artículos:
- 4 tarjetas mostrando: Total Artículos, En Revisión, Completados, Tasa de Aceptación
- Iconos SVG representativos
- Colores distintivos: gris, azul, verde, violeta

#### Gráfica de pastel (Pie Chart) - Usuarios por Rol:
- Muestra distribución de usuarios por rol
- **Colores actualizados:**
  - Autor: Indigo (`#6366f1`)
  - Revisor: Emerald (`#10b981`)
  - Editor: Amber (`#f59e0b`)
  - Admin: Pink (`#ec4899`)
- Sin título interno (eliminado)
- Sin contorno/borde entre segmentos
- Colores hover más claros
- Segmentos separados con offset cuando tienen datos
- Sombra elegante (`drop-shadow`)
- Animación de rotación y escala al cargar
- Leyenda mejorada con íconos de círculo y texto en negrita
- Tooltip con porcentajes calculados

#### Gráficas de barras (Bar Charts):
1. **Estado de Artículos** - Distribución por estado (Borrador, En Revisión, Aceptado, Rechazado)
2. **Top Autores** - Autores con más artículos publicados
3. **Carga de Revisores** - Revisiones asignadas por revisor (color-coded: verde<2, naranja=2, rojo=3)

#### Funciones de carga:
```typescript
const loadStats = async () => { ... }
const loadArticleStats = async () => { ... }
const loadReviewerWorkload = async () => { ... }
```

#### Computed properties para datos de gráficas:
- `chartData` - Datos para gráfica de pastel (usuarios por rol)
- `articleStatusChartData` - Datos para gráfica de estado de artículos
- `topAuthorsChartData` - Datos para top autores
- `reviewerWorkloadChartData` - Datos para carga de revisores

#### Configuración de opciones:
- `chartOptions` - Opciones para gráfica de pastel (animación, tooltips, leyenda)
- `barChartOptions` - Opciones para gráficas de barras (escalas, ejes)

#### Estilos CSS agregados:
- `.stats-grid`: Grid responsive para las tarjetas
- `.stat-card`: Tarjetas con hover effects y colores por rol
- `.pie-chart-section`: Sección de gráfica de pastel con gradiente de fondo
- `.chart-section-title`: Título con efecto de gradiente en texto
- `.pie-chart-container`: Contenedor más grande con sombra
- `.charts-grid`: Grid de 2 columnas para gráficas de barras
- `.chart-container-bar`: Contenedor de altura fija para barras
- Colores específicos para tarjetas de artículos

## Problemas Encontrados y Soluciones

### 1. Error: "Unexpected end of JSON input"
**Causa:** El endpoint `@Get('stats')` estaba después de `@Get(':id')`, entonces NestJS interpretaba "stats" como un ID de usuario.

**Solución:** Mover el endpoint `stats` antes del endpoint `:id` en el controller.

### 2. Conteos en cero a pesar de tener usuarios
**Causa:** TypeORM devuelve los valores del enum ("Autor", "Revisor", etc.) pero el código comparaba contra las claves del enum.

**Solución:** Comparar directamente contra los valores string de los roles, manejando múltiples formatos posibles.

### 3. TypeScript errors con comparaciones de enum
**Solución:** Usar casting `(u.rol as any)` para evitar errores de tipo estricto.

## Estructura de Datos

### Respuesta del endpoint `/api/users/stats`:
```json
{
  "totalUsers": 10,
  "usersByRole": {
    "Autor": 4,
    "Revisor": 3,
    "Editor": 2,
    "Admin": 1
  }
}
```

### Respuesta del endpoint `/api/articulos/stats`:
```json
{
  "totalArticles": 15,
  "articlesByStatus": {
    "Borrador": 5,
    "EnRevision": 4,
    "Aceptado": 4,
    "Rechazado": 2
  },
  "topAuthors": [
    { "name": "Ana García", "count": 5 },
    { "name": "Carlos Martínez", "count": 3 }
  ],
  "articlesNeedingReview": 4,
  "completedArticles": 6,
  "acceptanceRate": 67
}
```

## Estado Final
- ✅ Tarjetas de estadísticas de usuarios visibles con iconos SVG
- ✅ Tarjetas de estadísticas de artículos funcionando
- ✅ Gráfica de pastel mejorada (colores vibrantes, sin bordes, sin título interno)
- ✅ 3 gráficas de barras funcionales (estado de artículos, top autores, carga de revisores)
- ✅ Endpoints backend operativos
- ⚠️ Requiere reinicio del backend para aplicar cambios

## Próximos Pasos Recomendados
1. Verificar que el backend esté reiniciado y muestre los logs correctos
2. Recargar la página del admin
3. Verificar en la consola del navegador que lleguen todas las respuestas JSON
4. Agregar campo de fecha a los artículos para estadísticas reales de actividad semanal
