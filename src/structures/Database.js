class Database {
  constructor(client) {
    this.client = client;
    this.r = client.r.db('Servers').table('Servers');
  }

  async getData(id) {
    const data = await this.r.get(id).run();
    return data[id].data;
  }

  async hasEntry(id) {
    const data = await this.r.get(id).run();
    if (data == null) return false;
    else return true;
  }

  async hasSetting(id, setting) {
    const entry = await this.hasEntry(id);
    if (!entry) return false;
    const data = await this.getData(id);
    return data.hasOwnProperty(setting);
  }

}

module.exports = Database;
