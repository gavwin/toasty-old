const HOURS = 3 * 60 * 60 * 1000;

class Pokemon {
  constructor(client) {
    this.client = client;
    this.r = client.r;
  }

  hasReceived(id) {
    return this.r.table('Pokemon')
      .get(id)
      .run()
      .then(response => {
        try {
          const data = response[id].next;
          if (!data) return false;
          return Date.now() - HOURS < data;
        } catch (err) {
          return false;
        }
      })
      .error(() => false);
  }

  nextPokemon(id) {
    return this.r.table('Pokemon')
      .get(id)
      .run()
      .then(response => {
        try {
          const data = response[id].next;
          if (!data) return false;
          return HOURS - (Date.now() - data);
        } catch (err) {
          return false;
        }
      });
  }

  addPokemon(newPokemon, user) {
    this.r.table('Pokemon')
      .get(user.id)
      .run()
      .then(response => {
        // Console.log(response);
        try {
          const data = response[user.id].pokemon;
          if (data[newPokemon]) {
            const oldCount = data[newPokemon].count;
            this.r.table('Pokemon')
              .get(user.id)
              .update({
                [user.id]: {
                  pokemon: { [newPokemon]: { count: oldCount + 1 } },
                  next: Date.now()
                }
              })
              .run()
              .then(response_ => {
                //console.log('Successfully updated count for pokemon.', response_);
              })
              .error(err => {
                console.log('Failed to update count for pokemon.', err);
              });
          } else {
            this.r.table('Pokemon')
              .get(user.id)
              .update({
                [user.id]: {
                  pokemon: {
                    [newPokemon]: {
                      name: newPokemon,
                      count: 1, gif: `http://www.pokestadium.com/sprites/xy/${newPokemon.toLowerCase()}.gif`
                    }
                  },
                  next: Date.now()
                }
              })
              .run()
              .then(_response => {
                //console.log('Successfully added in pokemon.', _response);
              })
              .error(err => {
                console.log('Failed to add in pokemon.', err);
              });
          }
        } catch (err) {
          this.r.table('Pokemon')
            .insert({
              id: user.id,
              [user.id]: {
                pokemon: {
                  [newPokemon]: {
                    name: newPokemon,
                    count: 1,
                    gif: `http://www.pokestadium.com/sprites/xy/${newPokemon.toLowerCase()}.gif`
                  }
                },
                next: Date.now()
              }
            })
            .run()
            .then(_response => {
              //console.log('Successfully added in pokemon via insert', _response);
            })
            .error(err_ => {
              console.log('Failed to add in pokemon via insert.', err_);
            });
        }
      })
      .error(err => {
        console.log(err);
      });
  }

  addPokemonForce(newPokemon, user) {
    this.r.table('Pokemon')
      .get(user.id)
      .run()
      .then(response => {
        // Console.log(response);
        try {
          const data = response[user.id].pokemon;
          if (data[newPokemon]) {
            const oldCount = data[newPokemon].count;
            this.r.table('Pokemon')
              .get(user.id)
              .update({
                [user.id]: {
                  pokemon: { [newPokemon]: { count: oldCount + 1 } }
                }
              })
              .run()
              .then(response_ => {
                //console.log('Successfully updated count for pokemon.', response_);
              })
              .error(err => {
                console.log('Failed to update count for pokemon.', err);
              });
          } else {
            this.r.table('Pokemon')
              .get(user.id)
              .update({
                [user.id]: {
                  pokemon: {
                    [newPokemon]: {
                      name: newPokemon,
                      count: 1, gif: `http://www.pokestadium.com/sprites/xy/${newPokemon.toLowerCase()}.gif`
                    }
                  }
                }
              })
              .run()
              .then(_response => {
                //console.log('Successfully added in pokemon.', _response);
              })
              .error(err => {
                console.log('Failed to add in pokemon.', err);
              });
          }
        } catch (err) {
          this.r.table('Pokemon')
            .insert({
              id: user.id,
              [user.id]: {
                pokemon: {
                  [newPokemon]: {
                    name: newPokemon,
                    count: 1,
                    gif: `http://www.pokestadium.com/sprites/xy/${newPokemon.toLowerCase()}.gif`
                  }
                },
                next: Date.now()
              }
            })
            .run()
            .then(_response => {
              //console.log('Successfully added in pokemon via insert', _response);
            })
            .error(err_ => {
              console.log('Failed to add in pokemon via insert.', err_);
            });
        }
      })
      .error(err => {
        console.log(err);
      });
  }

  removePokemon(newPokemon, user) {
    this.r.table('Pokemon')
      .get(user.id)
      .run()
      .then(response => {
        // Console.log(response);
        try {
          const data = response[user.id].pokemon;
          const oldCount = data[newPokemon].count;
          if (oldCount - 1 < 1) {
            delete data[newPokemon];
            //console.log(data);
            // console.log(data[newPokemon]);
            // console.log(data);
            this.r.table('Pokemon')
              .get(user.id)
              .replace({
                id: user.id,
                [user.id]: {
                  pokemon: data
                }
              })
              .run()
              .then(response_ => {
                //console.log('Successfully removed pokemon.', response_);
              })
              .error(err => {
                console.log('Failed to update count for pokemon.', err);
              });
          } else {
            //console.log(response[user.id].pokemon)
            this.r.table('Pokemon')
              .get(user.id)
              .update({
                [user.id]: {
                  pokemon: { [newPokemon]: { count: oldCount - 1 } }
                }
              })
              .run()
              .then(response_ => {
                //console.log('Successfully decremented count for pokemon.', response_);
              })
              .error(err => {
                console.log('Failed to update count for pokemon.', err);
              });
          }
        } catch (err) {
          console.error(err);
        }
      })
      .error(err => {
        console.log(err);
      });
  }

  getInventory(id) {
    const arr = [];
    return this.r.table('Pokemon')
      .get(id)
      .run()
      .then(response => {
        try {
          const data = response[id].pokemon;
          for (const key of Object.keys(data)) arr.push({ name: data[key].name, count: data[key].count });
          return arr;
        } catch (err) {
          return arr;
        }
      });
  }

  async hasPokemon(id, pokemon) {
    const inventory = await this.getInventory(id);
    return inventory.some(item => item.name.toLowerCase() === pokemon.toLowerCase());
  }
}

module.exports = Pokemon;
