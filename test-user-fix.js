/**
 * Script para probar que el fix del bug de contraseña funciona
 * 
 * Este script:
 * 1. Crea un usuario de prueba
 * 2. Intenta hacer login (debe funcionar)
 * 3. Cambia el rol del usuario (PATCH)
 * 4. Intenta hacer login de nuevo (debe seguir funcionando)
 */

const API_URL = 'http://localhost:3000/api';

// Generar email único para evitar conflictos
const testEmail = `test_${Date.now()}@prueba.com`;
const testPassword = 'password123';
const testUser = {
  nombre: 'Usuario Prueba Fix',
  email: testEmail,
  password: testPassword,
  rol: 'Autor'
};

let createdUserId = null;
let authToken = null;

async function createUser() {
  console.log('1. Creando usuario de prueba...');
  console.log('   Email:', testEmail);
  
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error('   Error al crear usuario:', error);
      return false;
    }
    
    const data = await response.json();
    createdUserId = data.user.id;
    authToken = data.token;
    console.log('   ✓ Usuario creado con ID:', createdUserId);
    return true;
  } catch (error) {
    console.error('   Error:', error.message);
    return false;
  }
}

async function login(email, password) {
  console.log(`   Intentando login con ${email}...`);
  
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (response.ok) {
      console.log('   ✓ Login exitoso');
      return true;
    } else {
      const error = await response.text();
      console.error('   ✗ Login fallido:', error);
      return false;
    }
  } catch (error) {
    console.error('   Error:', error.message);
    return false;
  }
}

async function changeRole() {
  console.log('3. Cambiando rol de Autor a Revisor...');
  
  try {
    const response = await fetch(`${API_URL}/users/${createdUserId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ rol: 'Revisor' })
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error('   Error al cambiar rol:', error);
      return false;
    }
    
    console.log('   ✓ Rol cambiado a Revisor');
    return true;
  } catch (error) {
    console.error('   Error:', error.message);
    return false;
  }
}

async function runTest() {
  console.log('=== PRUEBA DEL FIX DE CONTRASEÑA ===\n');
  
  // 1. Crear usuario
  if (!await createUser()) {
    console.log('\n❌ PRUEBA FALLIDA: No se pudo crear el usuario');
    process.exit(1);
  }
  
  // 2. Verificar login inicial
  console.log('\n2. Verificando login inicial...');
  if (!await login(testEmail, testPassword)) {
    console.log('\n❌ PRUEBA FALLIDA: Login inicial falló');
    process.exit(1);
  }
  
  // 3. Cambiar rol
  if (!await changeRole()) {
    console.log('\n❌ PRUEBA FALLIDA: No se pudo cambiar el rol');
    process.exit(1);
  }
  
  // 4. Verificar login después de cambiar rol (ESTE ES EL TEST CRÍTICO)
  console.log('\n4. Verificando login DESPUÉS de cambiar rol (test crítico)...');
  if (!await login(testEmail, testPassword)) {
    console.log('\n❌ PRUEBA FALLIDA: La contraseña se corrompió al cambiar el rol');
    console.log('   El bug NO está corregido');
    process.exit(1);
  }
  
  console.log('\n✅ PRUEBA EXITOSA: El fix funciona correctamente');
  console.log('   La contraseña se preservó al cambiar el rol');
  process.exit(0);
}

runTest();
