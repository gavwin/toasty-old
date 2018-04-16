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
    const user = msg.author;
    if (msg.channel.id === '208674478773895168') return msg.reply('Pokemon commands must be used in <#303206425113657344>!');
    /* eslint-disable max-len */
    /* Const { body } = await snekfetch.get(`https://discordbots.org/api/bots/${this.client.user.id}/votes?onlyids=1`)
      .set('Authorization', discordbotsToken)
        if (!body.includes(user.id)) return msg.reply(`:no_entry_sign: You can\'t use the Pokemon commands because you haven\'t upvoted me.\nType, \`${this.client.commandPrefix}upvote\` for the steps on how to upvote me.`);
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

    this.client.commands.pokemon++;

    //const newPokemon = randomPokemon();

    const newPokemon = ['Pikachu', 'Bulbasaur'][Math.floor(Math.random() * 2)];

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
