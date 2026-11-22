const http = require('http');
const Router = require('./lib/router');
const { HttpError, send } = require('./lib/http');
const UserStore = require('./store');
const registerRoutes = require('./routes');

const router = new Router();
registerRoutes(router, new UserStore());

const server = http.createServer(async (req, res) => {
  try {
    if (!(await router.handle(req, res))) send(res, 404, { error: 'not found' });
  } catch (e) {
    if (e instanceof HttpError) return send(res, e.status, { error: e.message });
    console.error(e);
    send(res, 500, { error: 'internal error' });
  }
});

module.exports = server;
