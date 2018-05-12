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

    const pe = this.client.emojis.get('440220815817048064');
    const gif = this.client.emojis.get('435540970554261504');
    if (!pe) {
      await this.client.pokemon.addPokemon(newPokemon, user);
      return msg.say(stripIndents`
        **${user.username}**, you've caught a **${newPokemon}**!
        ${newSprite}${newPokemon.toLowerCase()}.gif
      `);
    } else {
      await this.client.pokemon.addPokemon(newPokemon, user);
      const catchMsg = await msg.say(`${gif} catching...`);
      setTimeout(() => {
        return catchMsg.edit(stripIndents`
          **${user.username}**, ${pe.toString()} you've caught a **${newPokemon}**!
          ${newSprite}${newPokemon.toLowerCase()}.gif
        `);
      }, 2100);
      return null;
    }
  }
};
