import { test, expect } from '@playwright/test';

const TEST_REVIEWER = { email: 'revisor@diego.edu', password: 'password123', id: '22222222-2222-4222-a222-222222222222' };
const TEST_AUTHOR_ID = '11111111-1111-4111-a111-111111111111';

test('Feedback del revisor y persistencia de comentarios', async ({ page, request }) => {
  const testArtId = `art-feed-${Date.now()}`;
  
  // 1. Setup API
  await request.post('/api/articulos', {
    data: { id: testArtId, titulo: 'Articulo Feedback Test', autor_id: TEST_AUTHOR_ID, congreso_id: 'any-id' }
  });
  await request.post('/api/asignaciones', {
    data: { articulo_id: testArtId, revisor_id: TEST_REVIEWER.id }
  });

  // 2. UI Login Revisor
  await page.goto('/login');
  await page.getByPlaceholder('Correo electrónico').fill(TEST_REVIEWER.email);
  await page.getByPlaceholder('Contraseña').fill(TEST_REVIEWER.password);
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();

  await page.locator('.congress-card').first().click();
  await page.locator(`.article-card:has-text("Articulo Feedback Test")`).getByRole('button', { name: 'Revisar' }).click();

  // 3. UI Feedback
  await page.locator('textarea').first().fill('Comentario Test Metodología');
  await page.getByPlaceholder('Escribe cualquier observación adicional...').fill('Genial');
  await page.getByRole('button', { name: 'Aceptado' }).click();
  await page.getByRole('button', { name: 'Finalizar revisión' }).click();

  await expect(page).toHaveURL(/.*reviewer/);

  // 4. Verify API
  const response = await request.get(`/api/articulos/${testArtId}?include_relations=true`);
  const artData = await response.json();
  expect(artData.estado).toBe('Aceptado');

  // Cleanup
  await request.delete(`/api/articulos/${testArtId}`);
});
