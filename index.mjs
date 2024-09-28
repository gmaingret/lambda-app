import { createUser } from './api/user/createUser.js';
import { getUser } from './api/user/getUser.js';
import { updateUser } from './api/user/updateUser.js';
import { deleteUser } from './api/user/deleteUser.js';

export const handler = async (event) => {
  console.log('Event received by Lambda:', JSON.stringify(event, null, 2));

  // Extract HTTP method and path from the correct location in the event object
  const httpMethod = event.requestContext.http.method;
  const path = event.requestContext.http.path;

  console.log(`HTTP Method: ${httpMethod}, Path: ${path}`);

  // Routing logic
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
};
