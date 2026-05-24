/**
 * MIGRACIÓN: Agregar tags a los 3 revisores usando la API
 * Ejecutar con: npx ts-node src/database/migration-add-reviewer-tags.ts
 * Requiere que el backend esté corriendo en http://localhost:3000
 */

const API_URL = 'http://localhost:3000/api';

const revisoresConTags = [
  {
    email: 'maria.garcia@uni.edu',
    tags: ['Machine Learning', 'Data Science', 'Python'],
  },
  {
    email: 'carlos.lopez@uni.edu',
    tags: ['Blockchain', 'Criptografía', 'Seguridad'],
  },
  {
    email: 'ana.martinez@uni.edu',
    tags: ['IoT', 'Embedded Systems', 'C++'],
  },
];

async function runMigration() {
  console.log('🌱 Agregando tags a los revisores...\n');

  // Primero, obtener el token de un usuario admin
  console.log('[1/4] Obteniendo token de admin...');
  const adminLoginResponse = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'editor@uni.edu',
      password: 'editor123',
    }),
  });

  if (!adminLoginResponse.ok) {
    console.error('❌ Error haciendo login como editor. Intentando con admin...');
    
    const adminLoginResponse2 = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@uni.edu',
        password: 'admin123',
      }),
    });

    if (!adminLoginResponse2.ok) {
      console.error('❌ Error haciendo login. Por favor, inicia sesión en el frontend y usa tu token');
      return;
    }
    
    const adminData = await adminLoginResponse2.json();
    var adminToken = adminData.access_token;
  } else {
    const adminData = await adminLoginResponse.json();
    var adminToken = adminData.access_token;
  }
  
  console.log('✅ Login exitoso\n');

  // Obtener el primer congreso disponible
  console.log('[2/4] Obteniendo congreso...');
  const congresosResponse = await fetch(`${API_URL}/congresos`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });

  if (!congresosResponse.ok) {
    console.error('❌ Error obteniendo congresos');
    return;
  }

  const congresos = await congresosResponse.json();
  if (congresos.length === 0) {
    console.error('❌ No hay congresos en la base de datos');
    return;
  }

  const congresoId = congresos[0].id;
  console.log(`📍 Usando congreso: ${congresoId}\n`);

  // Obtener todos los tags del congreso
  console.log('[3/4] Obteniendo tags del congreso...');
  const tagsResponse = await fetch(`${API_URL}/congresos/${congresoId}/tags`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });

  if (!tagsResponse.ok) {
    console.error('❌ Error obteniendo tags del congreso');
    return;
  }

  let congresoTags = await tagsResponse.json();
  console.log(`📍 Tags existentes: ${congresoTags.map((t: any) => t.nombre).join(', ')}\n`);

  // Crear tags que no existen
  const allNeededTags = revisoresConTags.flatMap(r => r.tags);
  const uniqueNeededTags = [...new Set(allNeededTags)];

  for (const tagName of uniqueNeededTags) {
    const exists = congresoTags.some((t: any) => t.nombre === tagName);
    if (!exists) {
      console.log(`Creando tag: ${tagName}`);
      const createTagResponse = await fetch(`${API_URL}/congresos/${congresoId}/tags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ nombre: tagName }),
      });

      if (createTagResponse.ok) {
        const newTag = await createTagResponse.json();
        congresoTags.push(newTag);
        console.log(`✅ Tag creado: ${tagName}`);
      } else {
        console.error(`❌ Error creando tag: ${tagName}`);
      }
    }
  }

  // Recargar tags después de crear los nuevos
  const tagsResponse2 = await fetch(`${API_URL}/congresos/${congresoId}/tags`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  congresoTags = await tagsResponse2.ok ? await tagsResponse2.json() : congresoTags;

  console.log('\n[4/4] Asignando tags a revisores...');
  let asignaciones = 0;

  for (const revisorInfo of revisoresConTags) {
    try {
      // Login como el revisor
      const loginResponse = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: revisorInfo.email,
          password: 'password123',
        }),
      });

      if (!loginResponse.ok) {
        console.error(`[❌] Error haciendo login para ${revisorInfo.email}`);
        continue;
      }

      const loginData = await loginResponse.json();
      const token = loginData.access_token;

      // Obtener el ID del usuario
      const meResponse = await fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!meResponse.ok) {
        console.error(`[❌] Error obteniendo info de ${revisorInfo.email}`);
        continue;
      }

      const userData = await meResponse.json();
      const userId = userData.id;

      // Asignar cada tag al revisor
      for (const tagName of revisorInfo.tags) {
        const tag = congresoTags.find((t: any) => t.nombre === tagName);
        if (!tag) {
          console.error(`[❌] Tag ${tagName} no encontrado`);
          continue;
        }

        // Verificar si ya tiene el tag asignado
        const revisorTagsResponse = await fetch(`${API_URL}/congresos/${congresoId}/revisor-tags`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });

        if (revisorTagsResponse.ok) {
          const revisorTags = await revisorTagsResponse.json();
          const yaTieneTag = revisorTags.some((rt: any) => rt.user_id === userId && rt.tag_id === tag.id);

          if (yaTieneTag) {
            console.log(`[⚠] ${revisorInfo.email} ya tiene el tag ${tagName}`);
            continue;
          }
        }

        // Asignar tag usando el endpoint directo
        const asignarTagResponse = await fetch(`${API_URL}/congresos/${congresoId}/revisor-tags`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            user_id: userId,
            tag_id: tag.id,
          }),
        });

        if (asignarTagResponse.ok) {
          console.log(`[✅] Tag "${tagName}" asignado a ${revisorInfo.email}`);
          asignaciones++;
        } else {
          console.error(`[❌] Error asignando tag ${tagName} a ${revisorInfo.email}`);
        }
      }
    } catch (error) {
      console.error(`[❌] Error procesando ${revisorInfo.email}:`, error);
    }
  }

  console.log(`\n🎉 Migración completada.`);
  console.log(`   - Tags asignados: ${asignaciones}`);
}

runMigration().catch((err) => {
  console.error('❌ Error en la migración:', err);
  process.exit(1);
});
