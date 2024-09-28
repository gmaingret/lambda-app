import { handler } from './index.mjs';

const event = {
  httpMethod: 'POST',
  path: '/user',
  body: JSON.stringify({ Name: 'John', Age: 30, Email: 'john@example.com' }),
};

handler(event)
  .then(response => console.log(response))
  .catch(error => console.error(error));