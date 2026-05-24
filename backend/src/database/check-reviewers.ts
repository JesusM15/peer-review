/**
 * Script para verificar si los revisores fueron creados correctamente usando la API
 * Ejecutar con: npx ts-node src/database/check-reviewers.ts
 */

const API_URL = 'http://localhost:3000/api';

async function checkReviewers() {
  console.log('🔍 Verificando revisores usando la API...\n');

  try {
    // Intentar login con diferentes credenciales
    let token = '';
    const credentials = [
      { email: 'editor@uni.edu', password: 'editor123' },
      { email: 'admin@uni.edu', password: 'admin123' },
    ];

    for (const cred of credentials) {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cred),
      });

      if (response.ok) {
        const data = await response.json();
        token = data.access_token;
        console.log(`✅ Login exitoso como ${cred.email}\n`);
        break;
      }
    }

    if (!token) {
      console.error('❌ No se pudo hacer login. Por favor, inicia sesión en el frontend y proporciona tu token.');
      console.log('   O usa este script con tu token manualmente.');
      return;
    }

    // Obtener todos los usuarios
    const usersResponse = await fetch(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!usersResponse.ok) {
      console.error('❌ Error obteniendo usuarios');
      return;
    }

    const users = await usersResponse.json();
    const revisores = users.filter((u: any) => u.rol === 'Revisor');

    console.log(`📊 Total de usuarios: ${users.length}`);
    console.log(`📊 Total de revisores: ${revisores.length}\n`);

    if (revisores.length === 0) {
      console.log('❌ No hay revisores en el sistema');
      console.log('\n� Para crear revisores manualmente:');
      console.log('   1. Ve a la página de registro');
      console.log('   2. Registra usuarios con rol "Revisor"');
      console.log('   3. Actualiza sus perfiles con especialidades');
    } else {
      console.log('📋 Lista de revisores:');
      revisores.forEach((r: any) => {
        console.log(`\n👤 ${r.nombre} (${r.email})`);
        console.log(`   ID: ${r.id}`);
        console.log(`   Rol: ${r.rol}`);
      });
    }

    // Verificar específicamente los 3 revisores que deberíamos haber creado
    const emails = ['maria.garcia@uni.edu', 'carlos.lopez@uni.edu', 'ana.martinez@uni.edu'];
    console.log('\n\n🔍 Verificando revisores específicos:');
    
    for (const email of emails) {
      const user = users.find((u: any) => u.email === email);
      
      if (user) {
        console.log(`\n✅ ${email}:`);
        console.log(`   Rol: ${user.rol}`);
        console.log(`   ID: ${user.id}`);
      } else {
        console.log(`\n❌ ${email}: No encontrado`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkReviewers();
