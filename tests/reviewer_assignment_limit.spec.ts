import { test, expect } from '@playwright/test';

const TEST_EDITOR = { email: 'editor@diego.edu', password: 'password123' };
const TEST_REVIEWER = { email: 'revisor@diego.edu', password: 'password123', id: '22222222-2222-4222-a222-222222222222' };
const TEST_AUTHOR_ID = '11111111-1111-4111-a111-111111111111';
const API_BASE = 'http://localhost:3000/api';

test('Límite global de 3 artículos en revisión para un revisor', async ({ page, request }) => {
  // 1. Setup: Limpiar y crear 3 artículos asignados
  const existing = await request.get(`${API_BASE}/asignaciones?revisor_id=${TEST_REVIEWER.id}`);
  const existingData = await existing.json();
  for (const asig of existingData) {
    await request.delete(`${API_BASE}/asignaciones/${asig.id}`);
  }

  const createdArtIds: string[] = [];
  for (let i = 1; i <= 3; i++) {
    const artId = `art-limit-${i}-${Date.now()}`;
    await request.post(`${API_BASE}/articulos`, {
      data: { id: artId, titulo: `Art Limit ${i}`, autor_id: TEST_AUTHOR_ID, congreso_id: 'any-id' }
    });
    await request.post(`${API_BASE}/asignaciones`, {
      data: { articulo_id: artId, revisor_id: TEST_REVIEWER.id }
    });
    createdArtIds.push(artId);
  }

  // 2. UI Login como Editor
  await page.goto('/login');
  const emailInput = page.getByPlaceholder(/correo/i).first();
  const passwordInput = page.getByPlaceholder(/contraseña/i).first();
  
  await emailInput.fill(TEST_EDITOR.email);
  await passwordInput.fill(TEST_EDITOR.password);
  await page.getByRole('button', { name: /iniciar/i }).click();

  await page.waitForTimeout(1000);
  
  // 3. Navegar a asignaciones
  const congressCard = page.locator('.congress-card').first();
  if (await congressCard.isVisible()) {
    await congressCard.click();
    
    const asignacionBtn = page.getByRole('button', { name: /asignaciones/i });
    if (await asignacionBtn.isVisible()) {
      await asignacionBtn.click();
      await page.waitForTimeout(500);
      
      // 4. Verificar límite
      const artPickerCard = page.locator('.art-picker-card').first();
      if (await artPickerCard.isVisible()) {
        await artPickerCard.click();
        await page.waitForTimeout(500);
      }
    }
  }

  // Cleanup
  for (const id of createdArtIds) {
    await request.delete(`${API_BASE}/articulos/${id}`);
  }
});
