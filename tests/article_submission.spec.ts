import { test, expect } from '@playwright/test';
import path from 'path';

const TEST_AUTHOR = { email: 'autor@diego.edu', password: 'password123', id: '11111111-1111-4111-a111-111111111111' };
const PDF_PATH = path.join(__dirname, 'Practica3-parte2.pdf');

test('Creación de artículo por un autor y persistencia en BD', async ({ page, request }) => {
  // 1. Login
  await page.goto('/login');
  await page.getByPlaceholder('Correo electrónico').fill(TEST_AUTHOR.email);
  await page.getByPlaceholder('Contraseña').fill(TEST_AUTHOR.password);
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();

  // 2. Seleccionar congreso
  const congressCard = page.locator('.congress-card').first();
  await congressCard.waitFor({ state: 'visible' });
  await congressCard.click();

  // 3. Crear artículo
  await page.getByRole('button', { name: 'Registrar artículo' }).click();
  const testTitle = `Test Subm ${Date.now()}`;
  await page.getByPlaceholder('Título del artículo').fill(testTitle);
  
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: 'Documento PDF' }).click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(PDF_PATH);

  await page.locator('#btn-submit-articulo').click();
  await expect(page.getByText(/exitoso|éxito/i)).toBeVisible();

  // 4. Verificación vía API
  const response = await request.get(`/api/articulos?autor_id=${TEST_AUTHOR.id}`);
  expect(response.ok()).toBeTruthy();
  const articulos = await response.json();
  const created = articulos.find((a: any) => a.titulo === testTitle);
  
  expect(created).toBeDefined();
  expect(created.autor_id).toBe(TEST_AUTHOR.id);
  expect(created.congreso_id).not.toBeNull();
  
  // Cleanup
  await request.delete(`/api/articulos/${created.id}`);
});
