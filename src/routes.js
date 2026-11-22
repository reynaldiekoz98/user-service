const { HttpError } = require('./lib/http');
const { parseUser } = require('./validate');

module.exports = (router, store) => {
  const find = ({ params }) => {
    const user = store.get(Number(params.id));
    if (!user) throw new HttpError(404, 'user not found');
    return user;
  };

  router.get('/health', ({ send }) => send(200, { status: 'ok', service: 'user-service' }));
  router.get('/users', ({ send }) => send(200, store.list()));
  router.post('/users', async ({ json, send }) => send(201, store.create(parseUser(await json()))));
  router.get('/users/:id', ctx => ctx.send(200, find(ctx)));
  router.put('/users/:id', async ctx => { find(ctx); ctx.send(200, store.update(Number(ctx.params.id), parseUser(await ctx.json()))); });
  router.delete('/users/:id', ctx => { find(ctx); ctx.send(200, store.remove(Number(ctx.params.id))); });
};
