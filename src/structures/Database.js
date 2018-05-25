class Database {
  constructor(client) {
    this.client = client;
    this.r = client.r.db('Servers').table('Servers');
    this.settings = ['joinMessage', 'leaveMessage', 'joinDM', 'joinRole', 'joinlog', 'modlog', 'noinvite', 'nonsfw', 'roles'];
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
    if (data.hasOwnProperty(setting)) return true;
  }

  async getData(id) {
    if (!await this.hasEntry(id)) return {
      joinMessage: 'disabled',
      leaveMessage: 'disabled',
      joinDM: 'disabled',
      joinRole: 'disabled',
      joinlog: 'disabled',
      modlog: 'disabled',
      noinvite: 'disabled',
      nonsfw: 'disabled',
      DJRole: 'disabled',
      roles: []
    };
    const data = await this.r.get(id).run();
    return data[id].data;
  }

  createSetting(id, setting, value) {
    this.r
    .insert({
      id: id,
      [id]: {
        data: {
          [setting]: value
        }
      }
    })
    .run()
    .then(response => {
      //console.log('response:', response);
    }).error(err => {
      console.log('error in createSetting:', err);
    });
  }

  editSetting(id, setting, value) {
    this.r.get(id)
    .update({
      id: id,
      [id]: {
        data: {
          [setting]: value
        }
      }
    })
    .run()
    .then(response => {
      //console.log('response:', response);
    }).error(err => {
      console.log('error in editSetting:', err);
    });
  }

  async autoSet(id, setting, value) {
    if (!this.settings.includes(setting)) return console.error(`Error in database autoSet function:\n${setting} is not a valid setting!`);
    if (await this.hasEntry(id)) {
      if (await this.hasSetting(id, setting)) {
        await this.editSetting(id, setting, value);
      } else {
        await this.editSetting(id, setting, value);
      }
    } else {
      await this.createSetting(id, setting, value);
    }
  }

  async checkSetting(id, setting) {
    if (!this.settings.includes(setting)) return console.error(`Error in database checkSetting function:\n${setting} is not a valid setting!`);
    if (await this.hasEntry(id)) {
      if (await this.hasSetting(id, setting)) {
        let data = await this.getData(id);
        data = data[setting];
        if (data === 'enabled') {
          return 'enabled';
        } else if (data === 'disabled') {
          return 'disabled';
        } else {
          return data;
        }
      } else {
        return 'disabled';
      }
    } else {
      return 'disabled';
    }
  }

  async addRole(id, value) {
    if (await this.hasEntry(id)) {
      if (await this.hasSetting(id, 'roles')) {
        let data = await this.getData(id);
        data.roles.push(value);
        let arr = data.roles;
        this.r.get(id)
        .update({
          id: id,
          [id]: {
            data: {
              'roles': arr
            }
          }
        })
        .run()
        .then(response => {
          //console.log('response:', response);
        }).error(err => {
          console.log('error in addRole:', err);
        });
      } else {
        this.r.get(id)
        .update({
          id: id,
          [id]: {
            data: {
              'roles': [value]
            }
          }
        })
        .run()
        .then(response => {
          //console.log('response:', response);
        }).error(err => {
          console.log('error in addRole:', err);
        });
      }
    } else {
      this.r
      .insert({
        id: id,
        [id]: {
          data: {
            'roles': [value]
          }
        }
      })
      .run()
      .then(response => {
        //console.log('response:', response);
      }).error(err => {
        console.log('error in addRole:', err);
      });
    }
  }

  async removeRole(id, value) {
    if (await this.hasEntry(id)) {
      if (await this.hasSetting(id, 'roles')) {
        let data = await this.getData(id);
        let index = data.roles.indexOf(value);
        data.roles.splice(index, 1);
        let arr = data.roles;
        this.r.get(id)
        .update({
          id: id,
          [id]: {
            data: {
              'roles': arr
            }
          }
        })
        .run()
        .then(response => {
          //console.log('response:', response);
        }).error(err => {
          console.log('error in removeRole:', err);
        });
      } else {
        return;
      }
    } else {
      return;
    }
  }

  removeEntry(id) {
    if (this.hasEntry(id)) {
      this.r.get(id)
        .delete()
        .run()
        .then(response => {
          //console.log('response:', response);
        }).error(err => {
          console.error(`Failed to removeEntry on guild ${id}.\n${err}`);
        });
    } else {
      return;
    }
  }

}

module.exports = Database;
