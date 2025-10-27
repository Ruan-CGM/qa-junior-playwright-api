import { test, expect } from '@playwright/test';
import { getToken } from '../config';

const TOKEN = getToken();

test.describe.parallel('Testes de API Users', () => {
const baseUrl = 'https://gorest.co.in/public/v2';

test('Requisição GET /users', async ({ request }) => {
	const response = await request.get(`${baseUrl}/users`, {
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
	expect(responseObject[0]).toHaveProperty('name');
	expect(responseObject[0]).toHaveProperty('email');
	expect(responseObject[0]).toHaveProperty('gender');
	expect(responseObject[0]).toHaveProperty('status');

	console.log('🧪', responseObject[0])
});

test('Requisição POST /users | Criar novo usuário', async ({ request }) => {
	const email = `johndoeqa${Date.now()}@email.com`;
	const payload = {
		name: "John Doe Qa Tagplus",
		gender: "male",
		email,
		status: "active"
	};

	const response = await request.post(`${baseUrl}/users`, {
		headers: {
			Authorization: `Bearer ${TOKEN}`
		},
		data: payload
	});

	const responseObject = await response.json();

	expect(response.status()).toBe(201);

	expect(responseObject).toHaveProperty('id');
	expect(responseObject).toHaveProperty('name', payload.name);
	expect(responseObject).toHaveProperty('email', payload.email);
	expect(responseObject).toHaveProperty('gender', payload.gender);
	expect(responseObject).toHaveProperty('status', payload.status);

	console.log('🧪', responseObject);

	const getResponse = await request.get(`${baseUrl}/users/${responseObject.id}`, {
		headers: {
			Authorization: `Bearer ${TOKEN}`
		}
	});

	const getResponseObject = await getResponse.json();

	expect(getResponse.status()).toBe(200);

	expect(getResponseObject).toHaveProperty('id', responseObject.id);
	expect(getResponseObject).toHaveProperty('name', responseObject.name);
	expect(getResponseObject).toHaveProperty('email', responseObject.email);
	expect(getResponseObject).toHaveProperty('gender', responseObject.gender);
	expect(getResponseObject).toHaveProperty('status', responseObject.status);

	console.log('🧪🧪', getResponseObject);
});

test('Requisição POST | PUT | DELETE /users | Criar, Atualizar e Deletar usuário', async ({ request }) => {
	const email = `johndoeqa2@email.com`;
	const payload = {
		name: "John Doe Qa Tagplus 2",
		gender: "female",
		email,
		status: "active"
	};

	const response = await request.post(`${baseUrl}/users`, {
		headers: {
			Authorization: `Bearer ${TOKEN}`
		},
		data: payload
	});

	const responseObject = await response.json();
	expect(response.status()).toBe(201);

	const updatedData = {
		name: 'John Doe Qa Tagplus Updated',
		gender: 'male',
		email: `user_updated_${Date.now()}@mail.com`,
		status: 'inactive'
	};

	const putResponse = await request.put(`${baseUrl}/users/${responseObject.id}`, {
		headers: {
			Authorization: `Bearer ${TOKEN}`
	},
		data: updatedData
	});

	const putResponseObject = await putResponse.json();

	expect(putResponse.status()).toBe(200);

	expect(putResponseObject).toHaveProperty('id');
	expect(putResponseObject).toHaveProperty('name', putResponseObject.name);
	expect(putResponseObject).toHaveProperty('email', putResponseObject.email);
	expect(putResponseObject).toHaveProperty('gender', putResponseObject.gender);
	expect(putResponseObject).toHaveProperty('status', putResponseObject.status);

	console.log('🧪', putResponseObject);

	const getResponse = await request.get(`${baseUrl}/users/${responseObject.id}`, {
		headers: {
			Authorization: `Bearer ${TOKEN}`
	}
	});

	const getResponseObject = await getResponse.json();

	console.log('🧪🧪', getResponse);

	expect(getResponse.status()).toBe(200);

	expect(getResponseObject).toHaveProperty('id', putResponseObject.id);
	expect(getResponseObject).toHaveProperty('name', putResponseObject.name);
	expect(getResponseObject).toHaveProperty('email', putResponseObject.email);
	expect(getResponseObject).toHaveProperty('gender', putResponseObject.gender);
	expect(getResponseObject).toHaveProperty('status', putResponseObject.status);

	console.log('🧪🧪', getResponseObject);


	const deleteResponse = await request.delete(`${baseUrl}/users/${responseObject.id}`, {
		headers: { 
			Authorization: `Bearer ${TOKEN}` 
	}
	});

	expect(deleteResponse.status()).toBe(204);

	const getDeleted = await request.get(`${baseUrl}/users/${responseObject.id}`, {
		headers: { 
			Authorization: `Bearer ${TOKEN}` 
	}
	});

	expect(getDeleted.status()).toBe(404);

	console.log('❌', getDeleted);

});

test('Assert de enpoint inválido', async ({ request}) => {
	const response = await request.get(`${baseUrl}/users/non-existent-endpoint`);
	expect(response.status()).toBe(404);
});

});
