const hrs = {
  three: 3 * 60 * 60 * 1000,
  twopointfive: 9000000,
  two: 2 * 60 * 60 * 1000,
  onepointfive: 5400000,
  one: 1 * 60 * 60 * 1000
};

class Pokemon {
  constructor(client) {
    this.client = client;
    this.r = client.r.db('Pokemon').table('Pokemon');
    this.donators = client.donators;
  }

  hasReceived(id) {
    return this.r.get(id)
      .run()
      .then(response => {
        try {
          const data = response[id].next;
          if (!data) return false;
          if (this.donators[id]) {
            if (this.donators[id].amount >= 60) {
              return Date.now() - hrs.one < data;
            } else
            if (this.donators[id].amount >= 20) {
              return Date.now() - hrs.onepointfive < data;
            } else
            if (this.donators[id].amount >= 10) {
              return Date.now() - hrs.two < data;
            } else
            if (this.donators[id].amount >= 5) {
              return Date.now() - hrs.twopointfive < data;
            } else
            if (this.donators[id].amount >= 3) {
              return Date.now() - hrs.three < data;
            } else
            if (this.donators[id].amount >= 1) {
              return Date.now() - hrs.three < data;
            }
          } else {
            return Date.now() - hrs.three < data;
          }
        } catch (err) {
          return false;
        }
      })
      .error(() => false);
  }

  nextPokemon(id) {
    return this.r.get(id)
      .run()
      .then(response => {
        try {
          const data = response[id].next;
          if (!data) return false;
          if (this.donators[id]) {
            if (this.donators[id].amount >= 60) {
              return hrs.one - (Date.now() - data);
            } else
            if (this.donators[id].amount >= 20) {
              return hrs.onepointfive - (Date.now() - data);
            } else
            if (this.donators[id].amount >= 10) {
              return hrs.two - (Date.now() - data);
            } else
            if (this.donators[id].amount >= 5) {
              return hrs.twopointfive - (Date.now() - data);
            } else
            if (this.donators[id].amount >= 3) {
              return hrs.three - (Date.now() - data);
            } else
            if (this.donators[id].amount >= 1) {
              return hrs.three - (Date.now() - data);
            }
          } else {
            return hrs.three - (Date.now() - data);
          }
        } catch (err) {
          return false;
        }
      });
  }

  addPokemon(newPokemon, id) {
    this.r.get(id)
      .run()
      .then(response => {
        // Console.log(response);
        try {
          const data = response[id].pokemon;
          if (data[newPokemon]) {
            const oldCount = data[newPokemon].count;
            this.r.get(id)
              .update({
                [id]: {
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
            this.r.get(id)
              .update({
                [id]: {
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
          this.r
            .insert({
              id: id,
              [id]: {
                pokemon: {
                  [newPokemon]: {
                    name: newPokemon,
                    count: 1
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

  addPokemonForce(newPokemon, id) {
    this.r.get(id)
      .run()
      .then(response => {
        // Console.log(response);
        try {
          const data = response[id].pokemon;
          if (data[newPokemon]) {
            const oldCount = data[newPokemon].count;
            this.r.get(id)
              .update({
                [id]: {
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
            this.r.get(id)
              .update({
                [id]: {
                  pokemon: {
                    [newPokemon]: {
                      name: newPokemon,
                      count: 1
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
          this.r
            .insert({
              id: id,
              [id]: {
                pokemon: {
                  [newPokemon]: {
                    name: newPokemon,
                    count: 1
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

  removePokemon(newPokemon, id) {
    this.r.get(id)
      .run()
      .then(response => {
        // Console.log(response);
        try {
          const data = response[id].pokemon;
          const oldCount = data[newPokemon].count;
          if (oldCount - 1 < 1) {
            delete data[newPokemon];
            this.r.get(id)
              .replace({
                id: id,
                [id]: {
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
            this.r.get(id)
              .update({
                [id]: {
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
          //console.error(err);
        }
      })
      .error(err => {
        console.log(err);
      });
  }

  getInventory(id) {
    const arr = [];
    return this.r.get(id)
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
