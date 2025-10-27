import { test, expect } from '@playwright/test';
import { getToken } from '../config';

const TOKEN = getToken();

test.describe.parallel('Testes de API /comments', () => {
  const baseUrl = 'https://gorest.co.in/public/v2';

test('Requisição GET /comments', async ({ request }) => {
  const response = await request.get(`${baseUrl}/comments`, {
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
  expect(responseObject[0]).toHaveProperty('post_id');
  expect(responseObject[0]).toHaveProperty('name');
  expect(responseObject[0]).toHaveProperty('email');
  expect(responseObject[0]).toHaveProperty('body');

  console.log('🧪', responseObject[0]);
});

test('Requisição POST /comments | Criar novo comentário', async ({ request }) => {
  const userPayload = {
    name: 'John Doe Qa Tagplus',
    gender: 'male',
    email: `johndoeqa_${Date.now()}@mail.com`,
    status: 'active'
  };

  const createUser = await request.post(`${baseUrl}/users`, {
    headers: { 
      Authorization: `Bearer ${TOKEN}` 
  },
    data: userPayload
  });

  const user = await createUser.json();

  const postPayload = {
    user_id: user.id,
    title: `Post para comentário ${Date.now()}`,
    body: 'Post criado para teste de comentários'
  };

  const createPost = await request.post(`${baseUrl}/posts`, {
    headers: { 
      Authorization: `Bearer ${TOKEN}` 
  },
    data: postPayload
  });

  const post = await createPost.json();

  const commentPayload = {
    post_id: post.id,
    name: 'John Doe Qa Tagplus',
    email: `johndoeqa_${Date.now()}@mail.com`,
    body: 'Comentário automatizado pelo teste'
  };

  const response = await request.post(`${baseUrl}/comments`, {
    headers: { 
      Authorization: `Bearer ${TOKEN}` 
  },
    data: commentPayload
  });

  const responseObject = await response.json();
  expect(response.status()).toBe(201);

  expect(responseObject).toHaveProperty('id');
  expect(responseObject).toHaveProperty('post_id', commentPayload.post_id);
  expect(responseObject).toHaveProperty('name', commentPayload.name);
  expect(responseObject).toHaveProperty('email', commentPayload.email);
  expect(responseObject).toHaveProperty('body', commentPayload.body);

  console.log('🧪', responseObject);

  const getResponse = await request.get(`${baseUrl}/comments/${responseObject.id}`, {
    headers: { 
      Authorization: `Bearer ${TOKEN}` 
    }
  });

  const getResponseObject = await getResponse.json();
  expect(getResponse.status()).toBe(200);

  expect(getResponseObject).toHaveProperty('id', responseObject.id);
  expect(getResponseObject).toHaveProperty('post_id', responseObject.post_id);
  expect(getResponseObject).toHaveProperty('name', responseObject.name);
  expect(getResponseObject).toHaveProperty('email', responseObject.email);
  expect(getResponseObject).toHaveProperty('body', responseObject.body);

  console.log('🧪🧪', getResponseObject);

});

test('POST | PUT | DELETE /comments | Criar, Atualizar e Deletar comentário', async ({ request }) => {
  const userPayload = {
    name: 'John Doe Qa Tagplus',
    gender: 'female',
    email: `user_comment_flow_${Date.now()}@mail.com`,
    status: 'active'
  };

  const createUser = await request.post(`${baseUrl}/users`, {
    headers: { 
    Authorization: `Bearer ${TOKEN}` 
  },
    data: userPayload
  });

  const user = await createUser.json();

  const postPayload = {
    user_id: user.id,
    title: `Post para comentário fluxo ${Date.now()}`,
    body: 'Post do fluxo de comentário automatizado'
  };

  const createPost = await request.post(`${baseUrl}/posts`, {
    headers: { 
    Authorization: `Bearer ${TOKEN}` 
  },
    data: postPayload
  });

  const post = await createPost.json();

  const commentPayload = {
    post_id: post.id,
    name: 'John Doe Qa Tagplus',
    email: `johndoeqa_${Date.now()}@mail.com`,
    body: 'Corpo do comentário original'
  };

  const createCommentResponse = await request.post(`${baseUrl}/comments`, {
    headers: { 
      Authorization: `Bearer ${TOKEN}` 
  },
    data: commentPayload
  });

  expect(createCommentResponse.status()).toBe(201);

  const createdComment = await createCommentResponse.json();

  const updatedData = {
    post_id: post.id,
    name: 'John Doe Qa Tagplus Atualizado',
    email: `atualizado_${Date.now()}@mail.com`,
    body: 'Corpo atualizado do comentário'
  };

  const putResponse = await request.put(`${baseUrl}/comments/${createdComment.id}`, {
    headers: { 
      Authorization: `Bearer ${TOKEN}` 
  },
    data: updatedData
  });

  const putResponseObject = await putResponse.json();

  expect(putResponse.status()).toBe(200);

  expect(putResponseObject).toHaveProperty('name', updatedData.name);
  expect(putResponseObject).toHaveProperty('email', updatedData.email);
  expect(putResponseObject).toHaveProperty('body', updatedData.body);
  expect(putResponseObject).toHaveProperty('post_id', updatedData.post_id);

  const getResponse = await request.get(`${baseUrl}/comments/${createdComment.id}`, {
    headers: { 
      Authorization: `Bearer ${TOKEN}` 
    }
  });

  const getResponseObject = await getResponse.json();
  expect(getResponse.status()).toBe(200);


  expect(getResponseObject).toHaveProperty('id', putResponseObject.id);
  expect(getResponseObject).toHaveProperty('name', putResponseObject.name);
  expect(getResponseObject).toHaveProperty('email', putResponseObject.email);
  expect(getResponseObject).toHaveProperty('body', putResponseObject.body);

  const deleteResponse = await request.delete(`${baseUrl}/comments/${createdComment.id}`, {
    headers: { 
      Authorization: `Bearer ${TOKEN}` 
    }
  });

  expect(deleteResponse.status()).toBe(204);

  const getDeleted = await request.get(`${baseUrl}/comments/${createdComment.id}`, {
    headers: { 
      Authorization: `Bearer ${TOKEN}` 
    }
  });

  expect(getDeleted.status()).toBe(404);
  console.log('❌', getDeleted);

  await request.delete(`${baseUrl}/posts/${post.id}`, {
    headers: { 
      Authorization: `Bearer ${TOKEN}` 
    }
  });

  await request.delete(`${baseUrl}/users/${user.id}`, {
    headers: { 
      Authorization: `Bearer ${TOKEN}` 
    }
  });
});

test('Assert para endpoint inválido', async ({ request }) => {
  const response = await request.get(`${baseUrl}/comments/non-existent-endpoint`);
  expect(response.status()).toBe(404);
});

});
