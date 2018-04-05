const { Command } = require('discord.js-commando');
const randomPokemon = require('pokemon-random');
const moment = require('moment');
require('moment-duration-format');
const { stripIndents, oneLine } = require('common-tags');

module.exports = class PokemonCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'pokemon',
      group: 'pokemon',
      memberName: 'pokemon',
      description: 'Lets you catch a Pokemon every 5 hours.',
      details: 'Lets you catch a random Pokemon every 5 hours and stores it in your virtual inventory.\nYou can trade pokemon with other players.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  async run(msg) {
    this.client.commands.pokemon++;
    const user = msg.author;
    if (msg.channel.id === '208674478773895168') return msg.reply('Pokemon commands must be used in <#303206425113657344>!');
    /* eslint-disable max-len */
    /* Const { body } = await snekfetch.get(`https://discordbots.org/api/bots/${this.client.user.id}/votes?onlyids=1`)
      .set('Authorization', discordbotsToken)
        if (!body.includes(user.id)) return msg.reply(`:no_entry_sign: You can\'t use the Pokemon commands because you haven\'t upvoted me.\nType, \`${this.client.commandPrefix}upvote\` for the steps on how to upvote me.`);
<<<<<<< HEAD
        */
    /* eslint-enable max-len */
    const received = await this.client.pokemon.hasReceived(user.id);
    if (received) {
      const next = await this.client.pokemon.nextPokemon(user.id);
      return msg.say(oneLine`
        :no_entry_sign: **${user.username}**,
        you need to wait another **${moment.duration(next).format(' H [hours], m [minutes] & s [seconds]')}** before catching another pokemon.
      `);
    }

    const newPokemon = randomPokemon();
=======
        */if (cooldown[user.id] && cooldown[user.id].time > 0 && msg.author.id !== '266619835738357770') return msg.say(`:no_entry_sign: **${user.username}**, you need to wait another **${moment.duration(cooldown[user.id].time).format(' H [hours], m [minutes] & s [seconds]')}** before catching another pokemon.`);
    if (!cooldown[user.id]) cooldown[user.id] = {time: 18000000}; //5 hours
    try {
      cooldown[user.id].time = 18000000; //5 hours
      setInterval(() => {
        if (!cooldown[user.id]) cooldown[user.id] = {time: 0};
        cooldown[user.id].time -= 10000; //remove 10 seconds
      }, 10000); //every 10 seconds
      setTimeout(() => {
        delete cooldown[user.id];
      }, 18000000); //5 hours
    } catch (e) {
      console.log('COOLDOWN ERROR:', e);
    }

    const newPokemon = randomPokemon();
    function addPokemon(newPokemon, user) {
      r.table('Pokemon')
        .get(user.id)
        .run()
        .then((response) => {
          //console.log(response);
          try {
            const data = response[user.id].pokemon;
            if (data[newPokemon]) {
              let count = data[newPokemon].count;
              r.table('Pokemon')
                .get(user.id)
                .update(
                  {[user.id]: {pokemon: {[newPokemon]: {count: count++}}}}
                )
                .run()
                .then((response) => {
                //console.log('Successfully updated count for pokemon.', response);
                })
                .error((err) => {
                //console.log('Failed to update count for pokemon.', err);
                });
            } else {
              r.table('Pokemon')
                .get(user.id)
                .update(
                  {[user.id]: {pokemon: {[newPokemon]: {name: newPokemon, count: 1, gif: `http://www.pokestadium.com/sprites/xy/${newPokemon.toLowerCase()}.gif`}}}}
                )
                .run()
                .then((response) => {
                //console.log('Successfully added in pokemon.', response);
                })
                .error((err) => {
                //console.log('Failed to add in pokemon.', err);
                });
            }
          } catch (err) {
            r.table('Pokemon')
              .insert({
                id: user.id,
                [user.id]: {
                  pokemon: { [newPokemon]: {name: newPokemon, count: 1, gif: `http://www.pokestadium.com/sprites/xy/${newPokemon.toLowerCase()}.gif`} }
                }
              })
              .run()
              .then((response) => {
              //console.log('Successfully added in pokemon via insert', response);
              })
              .error((err) => {
              //console.log('Failed to add in pokemon via insert.', err);
              });
          }
        })
        .error((err) => {
          //console.log(err);
        });
    }
>>>>>>> upstream/master

    try {
      const pe = this.client.emojis.get('328574358710910978');
      if (!pe) {
<<<<<<< HEAD
        await this.client.pokemon.addPokemon(newPokemon, user);
        return msg.say(stripIndents`
          **${user.username}**, you've caught a **${newPokemon}**!
          http://www.pokestadium.com/sprites/xy/${newPokemon.toLowerCase()}.gif
        `);
      } else {
        await this.client.pokemon.addPokemon(newPokemon, user);
        return msg.say(stripIndents`
          **${user.username}**, ${pe} you've caught a **${newPokemon}**!
          http://www.pokestadium.com/sprites/xy/${newPokemon.toLowerCase()}.gif
        `);
      }
    } catch (err) {
      console.error(err);
      return msg.say(`**${user.username}**, you failed to catch a pokemon :cry:`);
=======
        msg.say(`**${user.username}**, you've caught a **${newPokemon}**!\nhttp://www.pokestadium.com/sprites/xy/${newPokemon.toLowerCase()}.gif`);
        addPokemon(newPokemon, user);
      } else {
        msg.say(`**${user.username}**, ${pe} you've caught a **${newPokemon}**!\nhttp://www.pokestadium.com/sprites/xy/${newPokemon.toLowerCase()}.gif`);
        addPokemon(newPokemon, user);
      }
    } catch (e) {
      msg.say(`**${user.username}**, you failed to catch a pokemon :cry:`);
>>>>>>> upstream/master
    }
  }
};
