const test = require('node:test'); const assert = require('node:assert');
const server = require('./src/app');
test('user-service CRUD', async (t) => {
  await new Promise(r => server.listen(0, r));
  const base = `http://localhost:${server.address().port}`;
  t.after(() => server.close());
  const call = (m, p, b) => fetch(base + p, { method: m, body: b && JSON.stringify(b) });

  assert.strictEqual((await call('GET', '/health')).status, 200);
  assert.strictEqual((await (await call('GET', '/version')).json()).version, 'dev');
  assert.strictEqual((await (await call('GET', '/users/1')).json()).name, 'Alice');
  assert.strictEqual((await call('GET', '/users/99')).status, 404);

  const created = await call('POST', '/users', { name: 'Carol' });
  assert.strictEqual(created.status, 201);
  const { id } = await created.json();
  assert.strictEqual((await call('POST', '/users', {})).status, 400);

  const updated = await call('PUT', `/users/${id}`, { name: 'Caroline' });
  assert.strictEqual((await updated.json()).name, 'Caroline');

  assert.strictEqual((await call('DELETE', `/users/${id}`)).status, 200);
  assert.strictEqual((await call('GET', `/users/${id}`)).status, 404);
});
