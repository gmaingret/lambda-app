import { createUser } from './api/user/createUser.js';
import { getUser } from './api/user/getUser.js';
import { updateUser } from './api/user/updateUser.js';
import { deleteUser } from './api/user/deleteUser.js';

const routes = {
  POST: { "/user": createUser },
  GET: (path) => path.startsWith("/user/") && getUser,
  PUT: (path) => path.startsWith("/user/") && updateUser,
  DELETE: (path) => path.startsWith("/user/") && deleteUser
};

export const handler = async (event) => {
  console.log('Event received by Lambda:', JSON.stringify(event, null, 2));
  const { method: httpMethod, path } = event.requestContext.http;

  const routeHandler = routes[httpMethod]?.[path] || routes[httpMethod]?.(path);

  if (routeHandler) {
    return routeHandler(event);
  }

  return { statusCode: 404, body: JSON.stringify({ error: 'Not Found' }) };
};
