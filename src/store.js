class UserStore {
  constructor() {
    this.items = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
    this.nextId = 3;
  }
  list() { return this.items; }
  get(id) { return this.items.find(u => u.id === id); }
  create({ name }) { const u = { id: this.nextId++, name }; this.items.push(u); return u; }
  update(id, { name }) { const u = this.get(id); if (u) u.name = name; return u; }
  remove(id) { const u = this.get(id); this.items = this.items.filter(x => x.id !== id); return u; }
}
module.exports = UserStore;
