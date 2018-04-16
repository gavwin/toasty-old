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
      description: 'Catch a pokemon!',
      details: 'Lets you catch a random Pokemon every 3 hours and stores it in your virtual inventory.\nYou can trade pokemon with other players.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  async run(msg) {
    const user = msg.author;
    if (msg.channel.id === '208674478773895168') return msg.reply('Pokemon commands must be used in <#303206425113657344>!');

    /* eslint-enable max-len */
    const received = await this.client.pokemon.hasReceived(user.id);
    if (received) {
      const next = await this.client.pokemon.nextPokemon(user.id);
      return msg.say(oneLine`
        :no_entry_sign: **${user.username}**,
        you need to wait another **${moment.duration(next).format(' H [hours], m [minutes] & s [seconds]')}** before catching another pokemon.
      `);
    }

    this.client.commands.pokemon++;

    const newPokemon = randomPokemon();

    try {
      const pe = this.client.emojis.get('433754631328235532');
      if (!pe) {
        await this.client.pokemon.addPokemon(newPokemon, user);
        return msg.say(stripIndents`
          **${user.username}**, you've caught a **${newPokemon}**!
          http://www.pokestadium.com/sprites/xy/${newPokemon.toLowerCase()}.gif
        `);
      } else {
        await this.client.pokemon.addPokemon(newPokemon, user);
        return msg.say(stripIndents`
          **${user.username}**, ${pe.toString()} you've caught a **${newPokemon}**!
          http://www.pokestadium.com/sprites/xy/${newPokemon.toLowerCase()}.gif
        `);
      }
    } catch (err) {
      //console.error(err);
      return msg.say(`**${user.username}**, you failed to catch a pokemon :cry:`);
    }
  }
};
