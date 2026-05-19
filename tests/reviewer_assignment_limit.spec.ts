import { test, expect } from '@playwright/test';

const TEST_EDITOR = { email: 'editor@diego.edu', password: 'password123' };
const TEST_REVIEWER = { email: 'revisor@diego.edu', password: 'password123', id: '22222222-2222-4222-a222-222222222222' };
const TEST_AUTHOR_ID = '11111111-1111-4111-a111-111111111111';

test('Límite global de 3 artículos en revisión para un revisor', async ({ page, request }) => {
  // 1. Setup: Limpiar y crear 3 artículos asignados
  const existing = await request.get(`/api/asignaciones?revisor_id=${TEST_REVIEWER.id}`);
  const existingData = await existing.json();
  for (const asig of existingData) {
    await request.delete(`/api/asignaciones/${asig.id}`);
  }

  const createdArtIds: string[] = [];
  for (let i = 1; i <= 3; i++) {
    const artId = `art-limit-${i}-${Date.now()}`;
    await request.post('/api/articulos', {
      data: { id: artId, titulo: `Art Limit ${i}`, autor_id: TEST_AUTHOR_ID, congreso_id: 'any-id' }
    });
    await request.post('/api/asignaciones', {
      data: { articulo_id: artId, revisor_id: TEST_REVIEWER.id }
    });
    createdArtIds.push(artId);
  }

  // 2. UI Login como Editor
  await page.goto('/login');
  await page.getByPlaceholder('Correo electrónico').fill(TEST_EDITOR.email);
  await page.getByPlaceholder('Contraseña').fill(TEST_EDITOR.password);
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();

  await page.locator('.congress-card').first().click();
  await page.getByRole('button', { name: 'Asignaciones' }).click();

  // 3. UI: Seleccionar un artículo y verificar límite
  await page.locator('.art-picker-card').first().click();
  const reviewerCard = page.locator(`.revisor-card:has-text("${TEST_REVIEWER.email}")`);
  await reviewerCard.click();
  
  await expect(page.getByRole('button', { name: 'Asignar a este artículo' })).toBeDisabled();
  await expect(page.getByText(/límite alcanzado|3\/3/i)).toBeVisible();

  // Cleanup
  for (const id of createdArtIds) {
    await request.delete(`/api/articulos/${id}`);
  }
});
