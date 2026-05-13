import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Datos de prueba (Seed)
const USERS = {
  author: { email: 'autor@diego.edu', password: 'password123', id: '11111111-1111-4111-a111-111111111111' },
  reviewer: { email: 'revisor@diego.edu', password: 'password123', id: '22222222-2222-4222-a222-222222222222' },
  editor: { email: 'editor@diego.edu', password: 'password123' }
};

const API_BASE = 'http://localhost:3000/api';
const PDF_PATH = path.join(__dirname, 'Practica3-parte2.pdf');

test.describe('Backend API Business Logic Validation', () => {

  test('Validación de Login (Auth)', async ({ request }) => {
    const response = await request.post(`${API_BASE}/auth/login`, {
      data: { email: USERS.author.email, password: USERS.author.password }
    });
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.access_token).toBeDefined();
  });

  test('Creación de Artículo con congreso_id y persistencia', async ({ request }) => {
    const artId = `api-test-${Date.now()}`;
    const congresoId = 'congreso-test-id';
    
    const response = await request.post(`${API_BASE}/articulos`, {
      multipart: {
        id: artId,
        titulo: 'Articulo Test API',
        autor_id: USERS.author.id,
        congreso_id: congresoId,
        keywords: JSON.stringify(['test', 'api']),
        pdf: fs.createReadStream(PDF_PATH)
      }
    });

    expect(response.ok()).toBeTruthy();
    
    const getRes = await request.get(`${API_BASE}/articulos/${artId}`);
    const art = await getRes.json();
    
    expect(art.id).toBe(artId);
    expect(art.congreso_id).toBe(congresoId);
    
    await request.delete(`${API_BASE}/articulos/${artId}`);
  });

  test('Regla de Negocio: Límite global de 3 artículos por revisor', async ({ request }) => {
    const reviewerId = USERS.reviewer.id;
    
    const existing = await request.get(`${API_BASE}/asignaciones?revisor_id=${reviewerId}`);
    const existingData = await existing.json();
    for (const asig of existingData) {
      await request.delete(`${API_BASE}/asignaciones/${asig.id}`);
    }

    const artIds: string[] = [];
    for (let i = 1; i <= 3; i++) {
      const id = `limit-test-${i}-${Date.now()}`;
      artIds.push(id);
      await request.post(`${API_BASE}/articulos`, {
        data: { id, titulo: `Art Limit ${i}`, autor_id: USERS.author.id, congreso_id: 'c1' }
      });
      await request.post(`${API_BASE}/asignaciones`, {
        data: { articulo_id: id, revisor_id: reviewerId }
      });
    }

    const extraArtId = `limit-test-extra-${Date.now()}`;
    await request.post(`${API_BASE}/articulos`, {
      data: { id: extraArtId, titulo: 'Art Extra', autor_id: USERS.author.id, congreso_id: 'c1' }
    });
    artIds.push(extraArtId);

    const failRes = await request.post(`${API_BASE}/asignaciones`, {
      data: { articulo_id: extraArtId, revisor_id: reviewerId }
    });
    
    expect(failRes.status()).toBe(400);
    const errorBody = await failRes.json();
    expect(errorBody.message).toContain('máximo de 3');

    for (const id of artIds) {
      await request.delete(`${API_BASE}/articulos/${id}`);
    }
  });

  test('Proceso de Feedback y actualización de estado', async ({ request }) => {
    const artId = `feedback-test-${Date.now()}`;
    
    await request.post(`${API_BASE}/articulos`, {
      data: { id: artId, titulo: 'Feedback Target', autor_id: USERS.author.id, congreso_id: 'c1' }
    });
    await request.post(`${API_BASE}/asignaciones`, {
      data: { articulo_id: artId, revisor_id: USERS.reviewer.id }
    });

    await request.post(`${API_BASE}/revisiones`, {
      data: {
        articulo_id: artId,
        revisor_id: USERS.reviewer.id,
        decision: 'aceptado',
        comentarios: { intro: 'ok' },
        fecha_revision: new Date().toISOString()
      }
    });

    const checkRes = await request.get(`${API_BASE}/articulos/${artId}`);
    const art = await checkRes.json();
    expect(art.estado).toBe('Aceptado');

    await request.delete(`${API_BASE}/articulos/${artId}`);
  });
});
