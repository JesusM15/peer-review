/**
 * MIGRACIÓN: Agregar membresía de congreso a los 3 revisores usando la API
 * Ejecutar con: npx ts-node src/database/migration-add-reviewer-congress-membership.ts
 * Requiere que el backend esté corriendo en http://localhost:3000
 */

const API_URL = 'http://localhost:3000/api';

const revisoresEmails = [
  'maria.garcia@uni.edu',
  'carlos.lopez@uni.edu',
  'ana.martinez@uni.edu',
];

async function runMigration() {
  console.log('🌱 Agregando membresías de congreso a los revisores...\n');

  // Primero, obtener el token de un usuario admin
  console.log('[1/3] Obteniendo token de admin...');
  const adminLoginResponse = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@uni.edu',
      password: 'admin123',
    }),
  });

  if (!adminLoginResponse.ok) {
    console.error('❌ Error haciendo login como admin. Asegúrate de que admin@uni.edu exista con contraseña admin123');
    return;
  }

  const adminData = await adminLoginResponse.json();
  const adminToken = adminData.access_token;
  console.log('✅ Login exitoso como admin\n');

  // Obtener el primer congreso disponible
  console.log('[2/3] Obteniendo congreso...');
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

  // Agregar membresías a los revisores
  console.log('[3/3] Agregando membresías de congreso...');
  let agregados = 0;

  for (const email of revisoresEmails) {
    try {
      // Login como el revisor
      const loginResponse = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          password: 'password123',
        }),
      });

      if (!loginResponse.ok) {
        console.error(`[❌] Error haciendo login para ${email}`);
        continue;
      }

      const loginData = await loginResponse.json();
      const token = loginData.access_token;

      // Obtener el ID del usuario
      const meResponse = await fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!meResponse.ok) {
        console.error(`[❌] Error obteniendo info de ${email}`);
        continue;
      }

      const userData = await meResponse.json();
      const userId = userData.id;

      // Verificar si ya tiene membresía en el congreso
      const membresiasResponse = await fetch(`${API_URL}/congresos/${congresoId}/members`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      if (!membresiasResponse.ok) {
        console.error(`[❌] Error obteniendo miembros del congreso`);
        continue;
      }

      const membresias = await membresiasResponse.json();
      const yaTieneMembresia = membresias.some((m: any) => m.user_id === userId);

      if (yaTieneMembresia) {
        console.log(`[⚠] ${email} ya tiene membresía en el congreso`);
      } else {
        // Agregar membresía usando el endpoint de solicitudes
        const solicitudResponse = await fetch(`${API_URL}/congresos/${congresoId}/solicitudes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rol: 'Revisor',
          }),
        });

        if (!solicitudResponse.ok) {
          console.error(`[❌] Error creando solicitud para ${email}`);
          continue;
        }

        // Aprobar la solicitud como admin
        const solicitudesResponse = await fetch(`${API_URL}/congresos/${congresoId}/solicitudes`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });

        if (!solicitudesResponse.ok) {
          console.error(`[❌] Error obteniendo solicitudes`);
          continue;
        }

        const solicitudes = await solicitudesResponse.json();
        const solicitudUsuario = solicitudes.find((s: any) => s.user_id === userId);

        if (solicitudUsuario) {
          const aprobacionResponse = await fetch(`${API_URL}/congresos/${congresoId}/solicitudes/${solicitudUsuario.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${adminToken}`,
            },
            body: JSON.stringify({
              estado: 'Aprobado',
              rol: 'Revisor',
            }),
          });

          if (aprobacionResponse.ok) {
            console.log(`[✅] Membresía agregada para ${email}`);
            agregados++;
          } else {
            console.error(`[❌] Error aprobando solicitud para ${email}`);
          }
        }
      }
    } catch (error) {
      console.error(`[❌] Error procesando ${email}:`, error);
    }
  }

  console.log(`\n🎉 Migración completada.`);
  console.log(`   - Membresías agregadas: ${agregados}`);
}

runMigration().catch((err) => {
  console.error('❌ Error en la migración:', err);
  process.exit(1);
});
