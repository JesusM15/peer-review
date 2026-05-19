import { test, expect } from '@playwright/test';
import path from 'path';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await page.getByRole('textbox', { name: 'Correo electrónico' }).click();
  await page.getByRole('textbox', { name: 'Correo electrónico' }).fill('autor@diego.edu');
  await page.getByRole('textbox', { name: 'Contraseña' }).click();
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('password123');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  await page.getByRole('button', { name: 'Registrar artículo' }).click();
  await page.getByRole('textbox', { name: 'Título del artículo' }).click();
  await page.getByRole('textbox', { name: 'Título del artículo' }).fill('a');
  await page.getByRole('textbox', { name: 'Título del artículo' }).click();
  await page.getByRole('textbox', { name: 'Título del artículo' }).fill('articulo');
  await page.getByRole('button', { name: 'Documento PDF' }).click();
  await page.getByRole('button', { name: 'Documento PDF' }).setInputFiles(path.join(__dirname, 'Practica3-parte2.pdf'));
  await page.locator('#btn-submit-articulo').click();
});