import { test, expect, type APIRequestContext, type Page } from '@playwright/test';
import path from 'path';

const API_BASE = process.env.API_BASE_URL || '/api';
const PDF_PATH = path.join(__dirname, 'Practica3-parte2.pdf');
const PASSWORD = 'password123';

type TestUser = {
  id: string;
  email: string;
  password: string;
  token: string;
};

async function registerAuthor(request: APIRequestContext, prefix: string): Promise<TestUser> {
  const email = `${prefix}.${Date.now()}@example.com`;
  const res = await request.post(`${API_BASE}/auth/register`, {
    data: {
      nombre: `E2E ${prefix}`,
      email,
      password: PASSWORD,
      rol: 'Autor',
    },
  });
  await expectOk(res, `registrar usuario ${email}`);
  const data = await res.json();
  return {
    id: data.user.id,
    email,
    password: PASSWORD,
    token: data.token || data.access_token,
  };
}

async function expectOk(response: { ok(): boolean; status(): number; text(): Promise<string> }, action: string) {
  if (!response.ok()) {
    const body = await response.text().catch(() => '<sin cuerpo>');
    throw new Error(`Falló ${action}. HTTP ${response.status()}: ${body}`);
  }
}

async function ensureCongress(request: APIRequestContext) {
  const res = await request.get(`${API_BASE}/congresos`);
  await expectOk(res, 'listar congresos');
  const congresos = await res.json();
  if (congresos.length > 0) return congresos[0];

  const createRes = await request.post(`${API_BASE}/congresos`, {
    data: {
      nombre: `Congreso E2E ${Date.now()}`,
      descripcion: 'Congreso creado por pruebas e2e',
      tags: ['Pruebas', 'Software'],
    },
  });
  await expectOk(createRes, 'crear congreso base');
  return createRes.json();
}

async function joinCongress(request: APIRequestContext, user: TestUser, congresoId: string) {
  const res = await request.post(`${API_BASE}/congresos/${congresoId}/join`, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
  await expectOk(res, 'unirse al congreso');
}

async function loginFromUi(page: Page, user: TestUser) {
  await page.goto('/login');
  await page.getByPlaceholder('Correo electrónico').fill(user.email);
  await page.getByPlaceholder('Contraseña').fill(user.password);
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  await expect(page).not.toHaveURL(/.*login/);
}

async function enterFirstCongress(page: Page) {
  const congressCard = page.locator('.congress-card').first();
  await congressCard.waitFor({ state: 'visible' });
  await congressCard.click();
}

async function bestEffortDeleteUser(request: APIRequestContext, userId: string) {
  const adminLogin = await request.post(`${API_BASE}/auth/login`, {
    data: { email: 'admin@diego.edu', password: PASSWORD },
  });
  if (!adminLogin.ok()) return;
  const admin = await adminLogin.json();
  await request.delete(`${API_BASE}/users/${userId}`, {
    headers: { Authorization: `Bearer ${admin.token || admin.access_token}` },
  }).catch(() => undefined);
}

test.describe('Flujos de artículo y solicitudes', () => {
  test('autor crea un artículo desde UI y queda persistido con congreso', async ({ page, request }) => {
    const user = await registerAuthor(request, 'article');
    const congreso = await ensureCongress(request);
    await joinCongress(request, user, congreso.id);

    const title = `Articulo E2E ${Date.now()}`;
    let createdId = '';

    try {
      await loginFromUi(page, user);
      await enterFirstCongress(page);

      await page.locator('#nav-registrar-articulo').click();
      await page.getByPlaceholder('Ingrese el título del artículo').fill(title);
      await page.locator('#pdfFile').setInputFiles(PDF_PATH);

      const firstTag = page.locator('.tag-option input').first();
      if (await firstTag.count()) {
        await firstTag.check();
      }

      await page.locator('#btn-submit-articulo').click();
      await expect(page.getByText(/registrado con éxito/i)).toBeVisible();

      const articlesRes = await request.get(`${API_BASE}/articulos?autor_id=${user.id}&include_relations=true`);
      await expectOk(articlesRes, 'consultar artículos del autor');
      const articles = await articlesRes.json();
      const created = articles.find((article: any) => article.titulo === title);

      expect(created).toBeDefined();
      expect(created.autor_id).toBe(user.id);
      expect(created.congreso_id).toBe(congreso.id);
      expect(Array.isArray(created.tags || [])).toBeTruthy();
      createdId = created.id;
    } finally {
      if (createdId) await request.delete(`${API_BASE}/articulos/${createdId}`);
      await bestEffortDeleteUser(request, user.id);
    }
  });

  test('autor envía una solicitud de rol dentro del congreso actual', async ({ page, request }) => {
    const user = await registerAuthor(request, 'role-request');
    const congreso = await ensureCongress(request);
    await joinCongress(request, user, congreso.id);

    try {
      await loginFromUi(page, user);
      await enterFirstCongress(page);

      await page.locator('#nav-postulacion').click();
      await page.locator('select').selectOption('Revisor');
      const motivo = `Solicitud de rol E2E ${Date.now()}`;
      await page.getByPlaceholder(/Explica por qué deseas/i).fill(motivo);
      await page.getByRole('button', { name: 'Enviar Postulación' }).click();

      await expect(page.getByText(/Postulación enviada con éxito/i)).toBeVisible();

      const solicitudesRes = await request.get(`${API_BASE}/solicitudes/usuario/${user.id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      await expectOk(solicitudesRes, 'consultar solicitudes de rol');
      const solicitudes = await solicitudesRes.json();
      const created = solicitudes.find((sol: any) => sol.motivo_usuario === motivo);

      expect(created).toBeDefined();
      expect(created.congreso_id).toBe(congreso.id);
      expect(created.rol_solicitado).toBe('Revisor');
      expect(created.estado).toBe('Pendiente');
    } finally {
      await bestEffortDeleteUser(request, user.id);
    }
  });

  test('usuario solicita crear un congreso con tags obligatorios', async ({ page, request }) => {
    const user = await registerAuthor(request, 'congress-request');
    const proposedName = `Congreso Solicitud E2E ${Date.now()}`;
    const tags = ['IA', 'Testing', 'Software'];

    try {
      await loginFromUi(page, user);
      await page.goto('/solicitar-congreso');

      await page.getByLabel('Nombre del congreso *').fill(proposedName);
      await page.getByLabel('Descripción').fill('Congreso propuesto desde una prueba Playwright.');
      await page.getByLabel('Motivo / justificación').fill('Validar el flujo completo de solicitudes de congreso.');
      await page.getByLabel('Tags del congreso *').fill(tags.join(', '));
      await page.getByRole('button', { name: 'Enviar solicitud' }).click();

      await expect(page.getByText(/Solicitud enviada/i)).toBeVisible();

      const solicitudesRes = await request.get(`${API_BASE}/solicitudes-congreso/mias`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      await expectOk(solicitudesRes, 'consultar solicitudes de congreso');
      const solicitudes = await solicitudesRes.json();
      const created = solicitudes.find((sol: any) => sol.nombre_propuesto === proposedName);

      expect(created).toBeDefined();
      expect(created.estado).toBe('Pendiente');
      expect(created.tags).toEqual(expect.arrayContaining(tags));
    } finally {
      await bestEffortDeleteUser(request, user.id);
    }
  });
});
