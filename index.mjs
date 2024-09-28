import { createUser } from './api/user/createUser.js';
import { getUser } from './api/user/getUser.js';
import { updateUser } from './api/user/updateUser.js';
import { deleteUser } from './api/user/deleteUser.js';
import { handler as auth } from './sso/google/auth.js'; // Make sure this is correct

const routes = {
  POST: {
    "/user": createUser,
    "/sso/google": auth
  },
  GET: (path) => path.startsWith("/user/") && getUser,
  PUT: (path) => path.startsWith("/user/") && updateUser,
  DELETE: (path) => path.startsWith("/user/") && deleteUser
};

export const handler = async (event) => {
  console.log('Event received by Lambda:', JSON.stringify(event, null, 2));
  const { method: httpMethod, path } = event.requestContext.http;

  // Determine the route handler based on the HTTP method and path
  const routeHandler = typeof routes[httpMethod] === 'function'
    ? routes[httpMethod](path)
    : routes[httpMethod]?.[path];

  if (routeHandler) {
    // Invoke the route handler asynchronously
    return await routeHandler(event);
  }

  // Return 404 if no handler is found
  return { statusCode: 404, body: JSON.stringify({ error: 'Not Found' }) };
};
