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
    if (received && user.id !== '266619835738357770') {
      const next = await this.client.pokemon.nextPokemon(user.id);
      return msg.say(oneLine`
        :no_entry_sign: **${user.username}**,
        you need to wait another **${moment.duration(next).format(' H [hours], m [minutes] & s [seconds]')}** before catching another pokemon.
      `);
    }

    const newPokemon = randomPokemon();

    if (!newPokemon || typeof newPokemon === 'undefined') return msg.reply('you failed to catch a pokemon 😢');

    this.client.session.pokemon++;

    // const oldSprite = 'http://www.pokestadium.com/sprites/xy/';
    const newSprite = 'https://play.pokemonshowdown.com/sprites/xyani/';
    const newName = newPokemon.toLowerCase().replace(/\W/g, '');

    await this.client.pokemon.addPokemon(newPokemon, user.id);
    msg.say(stripIndents`
      **${user.username}**, <:pokeball:440220815817048064> you've caught a **${newPokemon}**!
      ${newSprite}${newName}.gif
    `);
  }
};
