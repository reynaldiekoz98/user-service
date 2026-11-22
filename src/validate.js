const { HttpError } = require('./lib/http');

function parseUser(input) {
  if (!input.name || typeof input.name !== 'string') throw new HttpError(400, 'name is required');
  return { name: input.name.trim() };
}
module.exports = { parseUser };
