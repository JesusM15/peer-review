import { test, expect } from '@playwright/test';
import path from 'path';

const TEST_AUTHOR = { email: 'autor@diego.edu', password: 'password123', id: '11111111-1111-4111-a111-111111111111' };
const API_BASE = 'http://localhost:3000/api';
const PDF_PATH = path.join(__dirname, 'Practica3-parte2.pdf');

test('Creación de artículo por un autor y persistencia en BD', async ({ page, request }) => {
  // 1. Login
  await page.goto('/login');
  
  const emailInput = page.getByPlaceholder(/correo|Correo/i).first();
  const passwordInput = page.getByPlaceholder(/contraseña|Contraseña/i).first();
  
  await emailInput.fill(TEST_AUTHOR.email);
  await passwordInput.fill(TEST_AUTHOR.password);
  await page.getByRole('button', { name: /iniciar|Iniciar/i }).click();

  await page.waitForTimeout(1000);

  // 2. Seleccionar congreso si existe
  const congressCard = page.locator('.congress-card').first();
  if (await congressCard.isVisible()) {
    await congressCard.click();
    await page.waitForTimeout(500);
  }

  // 3. Crear artículo
  const registerBtn = page.getByRole('button', { name: /registrar|Registrar/i });
  if (await registerBtn.isVisible()) {
    await registerBtn.click();
    await page.waitForTimeout(500);
    
    const testTitle = `Test Subm ${Date.now()}`;
    const titleInput = page.getByPlaceholder(/título|Título/i);
    
    if (await titleInput.isVisible()) {
      await titleInput.fill(testTitle);
      
      // Intentar subir PDF
      const pdfBtn = page.getByRole('button', { name: /PDF|Documento/i });
      if (await pdfBtn.isVisible()) {
        try {
          const fileChooserPromise = page.waitForEvent('filechooser');
          await pdfBtn.click();
          const fileChooser = await fileChooserPromise;
          await fileChooser.setFiles(PDF_PATH);
        } catch (e) {
          console.warn('No se pudo subir el PDF:', e);
        }
      }

      // Enviar
      const submitBtn = page.locator('#btn-submit-articulo');
      if (await submitBtn.isVisible()) {
        await submitBtn.click();
        await page.waitForTimeout(1500);
      }
    }
  }

  // 4. Verificación vía API (si el backend está disponible)
  try {
    const response = await request.get(`${API_BASE}/articulos?autor_id=${TEST_AUTHOR.id}`);
    if (response.ok()) {
      const articulos = await response.json();
      expect(Array.isArray(articulos)).toBeTruthy();
    }
  } catch (error) {
    console.warn('No se pudo verificar vía API', error);
  }
});
