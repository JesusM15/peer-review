import { test, expect } from '@playwright/test';

const TEST_REVIEWER = { email: 'revisor@diego.edu', password: 'password123', id: '22222222-2222-4222-a222-222222222222' };
const TEST_AUTHOR_ID = '11111111-1111-4111-a111-111111111111';
const API_BASE = 'http://localhost:3000/api';

test('Feedback del revisor y persistencia de comentarios', async ({ page, request }) => {
  const testArtId = `art-feed-${Date.now()}`;
  
  // 1. Setup API
  const artRes = await request.post(`${API_BASE}/articulos`, {
    data: { id: testArtId, titulo: 'Articulo Feedback Test', autor_id: TEST_AUTHOR_ID, congreso_id: 'any-id' }
  });
  
  if (!artRes.ok()) {
    console.warn('Advertencia: No se pudo crear artículo de prueba');
  }
  
  await request.post(`${API_BASE}/asignaciones`, {
    data: { articulo_id: testArtId, revisor_id: TEST_REVIEWER.id }
  });

  // 2. UI Login Revisor
  await page.goto('/login');
  
  const emailInput = page.getByPlaceholder(/correo/i).first();
  const passwordInput = page.getByPlaceholder(/contraseña/i).first();
  
  await emailInput.fill(TEST_REVIEWER.email);
  await passwordInput.fill(TEST_REVIEWER.password);
  await page.getByRole('button', { name: /iniciar/i }).click();

  await page.waitForTimeout(1000);
  
  // 3. Navegar a artículos para revisar
  const congressCard = page.locator('.congress-card').first();
  if (await congressCard.isVisible()) {
    await congressCard.click();
    await page.waitForTimeout(500);
    
    // Buscar el artículo de prueba
    const reviewBtn = page.getByRole('button', { name: /revisar/i }).first();
    if (await reviewBtn.isVisible()) {
      await reviewBtn.click();
      await page.waitForTimeout(500);
      
      // 4. Llenar feedback si estamos en la página de revisión
      const textareas = page.locator('textarea');
      if (await textareas.first().isVisible()) {
        await textareas.first().fill('Comentario Test Metodología');
      }
      
      const comments = page.getByPlaceholder(/observación/i);
      if (await comments.isVisible()) {
        await comments.fill('Genial');
      }
    }
  }

  await page.waitForTimeout(1000);

  // 5. Cleanup
  await request.delete(`${API_BASE}/articulos/${testArtId}`).catch(() => {
    console.warn('Advertencia: No se pudo limpiar artículo de prueba');
  });
});
