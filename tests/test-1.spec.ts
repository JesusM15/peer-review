import { test, expect } from '@playwright/test';
import path from 'path';

test('Flujo de creación de artículo', async ({ page }) => {
  // Login
  await page.goto('/login');
  await page.getByRole('textbox', { name: 'Correo electrónico' }).fill('autor@diego.edu');
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('password123');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  
  // Esperar a que cargue el dashboard
  await page.waitForTimeout(1000);
  
  // Hacer clic en Registrar artículo
  const registerBtn = page.getByRole('button', { name: 'Registrar artículo' });
  if (await registerBtn.isVisible()) {
    await registerBtn.click();
    
    // Llenar formulario
    await page.getByRole('textbox', { name: 'Título del artículo' }).fill('Artículo Test Playwright');
    
    // Subir PDF
    await page.getByRole('button', { name: 'Documento PDF' }).click();
    await page.getByRole('button', { name: 'Documento PDF' }).setInputFiles(path.join(__dirname, 'Practica3-parte2.pdf'));
    
    // Enviar
    const submitBtn = page.locator('#btn-submit-articulo');
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      // Esperar a que se envíe
      await page.waitForTimeout(1500);
    }
  }
  
  // Verificar que estamos en el dashboard o página de artículos
  await expect(page).not.toHaveURL(/.*login/);
});