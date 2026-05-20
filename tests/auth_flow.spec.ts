import { test, expect } from '@playwright/test';

test('Inicio de sesión exitoso', async ({ page }) => {
  const TEST_USER = { email: 'autor@diego.edu', password: 'password123' };
  
  await page.goto('/login');
  
  // Esperar a que los campos de entrada sean visibles
  await page.waitForSelector('input[type="email"], input[placeholder*="Correo"], input[placeholder*="correo"]');
  
  // Llenar el formulario
  const emailInput = page.getByPlaceholder(/Correo|correo/i).or(page.locator('input[type="email"]')).first();
  const passwordInput = page.getByPlaceholder(/Contraseña|contraseña/i).or(page.locator('input[type="password"]')).first();
  
  await emailInput.fill(TEST_USER.email);
  await passwordInput.fill(TEST_USER.password);
  
  // Click en el botón de inicio de sesión
  await page.getByRole('button', { name: /Iniciar sesión|iniciar/i }).click();
  
  // Esperar a que la redirección ocurra o que aparezca el dashboard
  await page.waitForTimeout(2000);
  
  // Verificar que no estamos en la página de login
  const currentUrl = page.url();
  const isNotOnLogin = !currentUrl.includes('/login');
  
  expect(isNotOnLogin).toBeTruthy();
});
