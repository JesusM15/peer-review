# Motor de Sincronización Offline

Este proyecto implementa un sistema de sincronización robusto diseñado para permitir que los usuarios (revisores, autores, editores) realicen acciones críticas sin conexión a internet, las cuales se sincronizarán automáticamente de forma transparente cuando se recupere la conectividad.

## 🚀 Arquitectura del Motor

El motor de sincronización (`useSyncEngine.ts`) funciona como un "middleware" entre la UI y las llamadas a la API.

### Componentes Principales

1.  **Cola de Sincronización (IndexedDB)**:
    Utiliza un store llamado `sync_queue` dentro de la base de datos `peer_review_offline`. Esto asegura que las acciones no se pierdan incluso si el usuario cierra la pestaña o reinicia el navegador.
    Cada elemento en la cola tiene la siguiente estructura:
    ```typescript
    {
      id: string;        // UUID único
      type: string;      // Ej: 'REVISION'
      payload: any;      // Datos de la acción a enviar
      status: string;    // 'pending' | 'syncing' | 'failed'
      attempts: number;  // Contador de reintentos
      timestamp: number; // Orden cronológico
    }
    ```

2.  **Handlers (Controladores)**:
    El motor es agnóstico al tipo de datos. Los handlers se registran globalmente (normalmente en `App.vue`) para definir cómo debe procesarse cada tipo de acción.
    ```typescript
    syncEngine.registerHandler('REVISION', async (data) => {
      return await fetch('/api/revisiones', { ... });
    });
    ```

### 📋 Bitácora de Prompts Reales del Usuario

Para mantener la trazabilidad de los cambios solicitados en esta sesión, se registran los prompts literales utilizados:

*   **Error de Sincronización**: *"cuando tengo red me sale esto, puedes ayudarme a solucionarlo?"* (Referente a errores 404/500 al enviar revisiones).
*   **Actualización de Dashboard**: *"bien funciona, ahora el problema es uno mas sencillo en el dashboard no se actualizan correctamente los numeros de los articulos completados o asi"*.
*   **Persistencia y Estados**: *"quiero que esto se active en cuanto se inicie el llenado de uno de estos campos... el articulo se ponga a en progreso... y que si llene introduccion o alguna otra seccion y me salgo se guarde mi progreso... esto de forma offline"*.
*   **Layout y Responsive**: *"ayudame con la vista de revision de articulos, el scroll rompe la web, el chiste es que solo haya scroll en cada seccion es decir, el scroll sea para el formulario y para el pdf pero no modifiquen la latura del sidebar y asi, y asegurate todo sea responsive"*.
*   **Estética y Consistencia**: *"modfiicaste muchos estilos, quitaste colores iconos y cosas asi, la flechita de volver atras se ve gigante, corrigelo para que se vea bien con la estetica que acostumbramos"*.
*   **Identidad Visual**: *"conserva esencia no pongas el logo de la web si no lo tiene, usa el mismo sidebar en cuestion de estilos, y no quites las descripciones... has que el pdf abarque la pantalla completa y se pueda scrollear por su visor"*.
*   **Temas y UI**: *"el veredicto final la parte de los selectores en modo claro se ven en modo oscuro no revisa eso, y debe poder permitirme cambiar de modo claro modo oscuro de la misma forma que el sidebar original"*.
*   **Filtros de Lista**: *"pues que al completarlo ya no me deberia salir para revisar, me deberia salir completado"*.
*   **Modo Lectura**: *"si aparte debo poder ver en solo lectura los articulos"*.
*   **Visibilidad de Datos**: *"no se ve lo que comente en secciones debe verse lo que revise... eso esta dentro de secciones en el schema de mongo db"*.
*   **Privacidad (Ciegas)**: *"no debo poder ver al autor por que se supone es a ciegas y otra cosa, sigo sin ver nada, sera que no guardo los datos cuando reviso?"*.
*   **Bug de Estados**: *"hay un bug, los que ya revise si le pico en el historial a ver, me cambia el estado a en revision, no deberia pasar eso"*.

### ✅ Cambios Aceptados y Aplicados
1.  **Layout de Doble Panel**: Scroll independiente para PDF y Formulario.
2.  **Sistema de Temas**: Sincronización completa con el toggle del sidebar original.
3.  **Mapeo MongoDB**: Uso del campo `secciones` para comentarios detallados.
4.  **Política Blind Review**: Eliminación total del nombre del autor en la interfaz del revisor.
5.  **Historial de Revisiones**: Sección dedicada en el dashboard para artículos finalizados.

---

> [!NOTE]
> Esta documentación sirve como referencia técnica para futuras expansiones del PWA y el motor de sincronización.
