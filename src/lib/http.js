class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

const send = (res, status, body) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
};

const readRaw = req => new Promise(resolve => {
  let data = '';
  req.on('data', chunk => data += chunk);
  req.on('end', () => resolve(data));
});

const readJson = async req => {
  const raw = await readRaw(req);
  try { return raw ? JSON.parse(raw) : {}; }
  catch { throw new HttpError(400, 'invalid json'); }
};

module.exports = { HttpError, send, readRaw, readJson };
