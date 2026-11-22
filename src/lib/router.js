const { send, readRaw, readJson } = require('./http');

class Router {
  constructor() { this.routes = []; }

  add(method, pattern, handler) {
    const keys = [];
    const re = new RegExp('^' + pattern.replace(/:(\w+)/g, (_, k) => { keys.push(k); return '([^/]+)'; }) + '$');
    this.routes.push({ method, re, keys, handler });
  }
  get(p, h) { this.add('GET', p, h); }
  post(p, h) { this.add('POST', p, h); }
  put(p, h) { this.add('PUT', p, h); }
  delete(p, h) { this.add('DELETE', p, h); }

  // returns true if a route handled the request
  async handle(req, res) {
    const url = req.url.split('?')[0];
    for (const route of this.routes) {
      if (route.method !== req.method) continue;
      const m = route.re.exec(url);
      if (!m) continue;
      const params = {};
      route.keys.forEach((k, i) => params[k] = decodeURIComponent(m[i + 1]));
      await route.handler({
        req, res, params, url,
        json: () => readJson(req),
        raw: () => readRaw(req),
        send: (status, body) => send(res, status, body),
      });
      return true;
    }
    return false;
  }
}

module.exports = Router;
