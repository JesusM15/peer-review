# 🪪 Agregado de Perfil y Consecuencias

## ¿Por qué existe una tabla de Perfil?

En nuestro sistema, la entidad \`User\` (Usuarios) está diseñada y orientada exclusivamente al manejo de la autenticación general y el control de acceso. Esto incluye datos críticos de acceso como:
- ID de usuario
- Correo electrónico (Email)
- Contraseña (encriptada con bcrypt)
- Rol (Autor, Revisor, Editor, Admin)

Sin embargo, en el dominio de nuestra aplicación (el **Peer Review**), cada entidad tiene características y detalles adicionales que no son requeridos para la capa de autenticación, pero que sí son vitales para el flujo de trabajo lógico. Aquí es donde entra la tabla **\`Perfil\`**.

La tabla \`perfiles\` tiene una relación **1 a 1** directa y estricta con \`usuarios\`. Funciona como una abstracción para almacenar toda la metadata y biografía que le pertenece y describe al usuario que usa el sistema.

### 📚 Columnas y Utilidad

- **\`id\` (UUID):** Para simplificar búsquedas, se opta por una infraestructura de *Clave Primaria Compartida* (Shared Primary key). El UUID del perfil es **exactamente el mismo** que el UUID del usuario. ¡No necesitas hacer JOINs complejos para saber de quién es el perfil si ya tienes el ID del usuario!
- **\`nombre\` (String):** El nombre de visualización al público y en el perfil de revisión o artículo.
- **\`carrera\` (String):** Carrera, profesión o campo de estudio al que pertenece.
- **\`especialidades\` (Arreglo Básico):** Un arreglo indexable en MariaDB utilizando el atributo simple-array, de etiquetas de especialidad (p. ej: "Inteligencia Artificial", "Bases de Datos"). Permite búsquedas veloces si un Editor necesita asignar un artículo de cierta especialidad a un Revisor afín.

---

## 🛠️ Instrucciones de Aplicación de Cambios

Todos estos cambios (la entidad misma y el reflejo de las llaves foráneas) han sido agregados a TypeORM. Nuestro proyecto cuenta con la opción \`synchronize: true\` en su etapa de desarrollo y gracias a la monitorización activa:

1. **La base de datos actualiza su esquema automáticamente**.
   Al iniciar el contenedor Docker o guardar un cambio de archivo de NestJS, MariaDB crea la tabla \`perfiles\` con su respectiva llave externa apuntando a \`users\`.

### 🚨 ¿Hay un comando de migración a ejecutar?

**Sí.** Debido a que ya contábamos con 4 usuarios en la base de datos (autor, revisor, editor, admin) que fueron creados *antes* de que existiera este componente, **ellos no tienen un perfil correspondiente** asociado en la tabla recién creada.

Si bien en el nuevo flujo de registro (creación/registro) *es obligación automatizada* que se construya inmediatamente un registro perfil en la DB, los antiguos darían error temporal si son consumidos actualmente.

He preparado por ello un **Script de Migración Retroactiva** que soluciona esto, iterando por los usuarios antiguos y adjuntándoles un perfil.

Para aplicar la migración y estandarizar la base de datos de manera definitiva, ejecuta:

```bash
docker exec peer_review_api npx ts-node src/database/migration-perfiles.ts
```

Luego de esto, tanto los usuarios antiguos como los nuevos del registro contarán con el modelo y la integridad de DB solicitada!
