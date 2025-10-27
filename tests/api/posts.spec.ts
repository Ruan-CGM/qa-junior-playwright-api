import { test, expect } from '@playwright/test';
import { getToken } from '../config';

const TOKEN = getToken();

test.describe.parallel('Testes de API /posts', () => {
    const baseUrl = 'https://gorest.co.in/public/v2';
    
    test('Requisição GET /posts', async ({ request }) => {
        const response = await request.get(`${baseUrl}/posts`, {
        headers: { 
            Authorization: `Bearer ${TOKEN}` 
        }
    });

    const responseObject = await response.json();

    console.log(responseObject);

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    expect(responseObject.length).toBeGreaterThan(0);
    expect(responseObject[0]).toHaveProperty('id');
    expect(responseObject[0]).toHaveProperty('user_id');
    expect(responseObject[0]).toHaveProperty('title');
    expect(responseObject[0]).toHaveProperty('body');

    console.log('🧪', responseObject[0]);

    });

  test('Requisição POST /posts | Criar novo post', async ({ request }) => {
    const getUserResponse = await request.get(`${baseUrl}/users`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });

    const users = await getUserResponse.json();
    const userId = users[0].id;

    const payload = {
      user_id: userId,
      title: `Título de teste ${Date.now()}`,
      body: 'Conteúdo do post de teste automatizado'
    };

    const response = await request.post(`${baseUrl}/posts`, {
      headers: { 
        Authorization: `Bearer ${TOKEN}` 
    },
      data: payload
    });

    const responseObject = await response.json();

    expect(response.status()).toBe(201);

    expect(responseObject).toHaveProperty('id');
    expect(responseObject).toHaveProperty('user_id', payload.user_id);
    expect(responseObject).toHaveProperty('title', payload.title);
    expect(responseObject).toHaveProperty('body', payload.body);

    console.log('🧪', responseObject);

    const getResponse = await request.get(`${baseUrl}/posts/${responseObject.id}`, {
      headers: { 
        Authorization: `Bearer ${TOKEN}` 
    }
    });

    const getResponseObject = await getResponse.json();

    expect(getResponse.status()).toBe(200);

    expect(getResponseObject).toHaveProperty('id', responseObject.id);
    expect(getResponseObject).toHaveProperty('user_id', responseObject.user_id);
    expect(getResponseObject).toHaveProperty('title', responseObject.title);
    expect(getResponseObject).toHaveProperty('body', responseObject.body);

    console.log('🧪🧪', getResponseObject);
  });

  test('Requisição POST | PUT | DELETE /posts | Criar, Atualizar e Deletar post', async ({ request }) => {
    const getUserResponse = await request.get(`${baseUrl}/users`, {
      headers: { 
        Authorization: `Bearer ${TOKEN}` 
        }
    });

    const users = await getUserResponse.json();
    const userId = users[0].id;

    const payload = {
      user_id: userId,
      title: 'Título original',
      body: 'Corpo original do post'
    };

    const response = await request.post(`${baseUrl}/posts`, {
      headers: { 
		Authorization: `Bearer ${TOKEN}` 
	},
      data: payload
    });

    const responseObject = await response.json();
    expect(response.status()).toBe(201);

    const updatedData = {
      user_id: userId, 
      title: 'Título atualizado',
      body: 'Corpo atualizado do post'
    };

    const putResponse = await request.put(`${baseUrl}/posts/${responseObject.id}`, {
      headers: { 
		Authorization: `Bearer ${TOKEN}` 
		},
      data: updatedData
    });

    const putResponseObject = await putResponse.json();

    expect(putResponse.status()).toBe(200);

    expect(putResponseObject).toHaveProperty('title', updatedData.title);
    expect(putResponseObject).toHaveProperty('body', updatedData.body);
    expect(putResponseObject).toHaveProperty('user_id', updatedData.user_id);

	console.log('🧪', putResponseObject);

    const getResponse = await request.get(`${baseUrl}/posts/${responseObject.id}`, {
      headers: { 
		Authorization: `Bearer ${TOKEN}` 
	}
    });

    const getResponseObject = await getResponse.json();

    expect(getResponse.status()).toBe(200);

    expect(getResponseObject).toHaveProperty('id', putResponseObject.id);
    expect(getResponseObject).toHaveProperty('title', putResponseObject.title);
    expect(getResponseObject).toHaveProperty('body', putResponseObject.body);

    const deleteResponse = await request.delete(`${baseUrl}/posts/${responseObject.id}`, {
      headers: { 
		Authorization: `Bearer ${TOKEN}` 
	}
    });

    expect(deleteResponse.status()).toBe(204);

    const getDeleted = await request.get(`${baseUrl}/posts/${responseObject.id}`, {
      headers: { 
		Authorization: `Bearer ${TOKEN}` 
	}
    });

    expect(getDeleted.status()).toBe(404);
    console.log('❌', getDeleted);
  });

  test('Assert para endpoint inválido', async ({ request }) => {
    const response = await request.get(`${baseUrl}/posts/non-existent-endpoint`);
    expect(response.status()).toBe(404);
  });

});
