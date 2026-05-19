import { test, expect } from '@playwright/test';

test('Inicio de sesión exitoso', async ({ page }) => {
  const TEST_USER = { email: 'autor@diego.edu', password: 'password123' };
  
  await page.goto('/login');
  await page.getByPlaceholder('Correo electrónico').fill(TEST_USER.email);
  await page.getByPlaceholder('Contraseña').fill(TEST_USER.password);
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  
  // Debería redirigir fuera del login
  await expect(page).not.toHaveURL(/.*login/);
  // Verificar que aparezca algún elemento del dashboard o selector de congreso
  await expect(page.locator('body')).toContainText(/Dashboard|Congreso/i);
});
