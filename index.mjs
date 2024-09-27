// index.mjs

export const handler = async (event) => {
  console.log('Handler invoked');

  let createUser, getUser, updateUser, deleteUser;

  try {
    // Dynamic imports to catch initialization errors
    ({ createUser } = await import('./api/user/createUser.js'));
    ({ getUser } = await import('./api/user/getUser.js'));
    ({ updateUser } = await import('./api/user/updateUser.js'));
    ({ deleteUser } = await import('./api/user/deleteUser.js'));
  } catch (error) {
    console.error('Initialization error during imports:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Initialization error during imports' }),
    };
  }

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
