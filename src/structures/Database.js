class Database {
  constructor(client) {
    this.client = client;
    this.r = client.r.db('Servers').table('Servers');
  }

  getData(id) {
    this.r.get(id)
      .run()
      .then(response => {
        console.log('response:', response[id].data);
        return response[id].data;
      })
      .error(err => {
        console.error('err:', err);
        return 'disabled';
      })
  }

}

module.exports = Database;
