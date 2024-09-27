// index.mjs
import { createUser } from './api/user/createUser.js';
import { getUser } from './api/user/getUser.js';
import { updateUser } from './api/user/updateUser.js';
import { deleteUser } from './api/user/deleteUser.js';

export const handler = async (event) => {
  const { httpMethod, path } = event;

  try {
    if (httpMethod === 'POST' && path === '/user') {
      return await createUser(event);
    } else if (httpMethod === 'GET' && path.startsWith('/user/')) {
      return await getUser(event);
    } else if (httpMethod === 'PUT' && path.startsWith('/user/')) {
      return await updateUser(event);
    } else if (httpMethod === 'DELETE' && path.startsWith('/user/')) {
      return await deleteUser(event);
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Not Found' }),
      };
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
