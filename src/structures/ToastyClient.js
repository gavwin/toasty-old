const { CommandoClient } = require('discord.js-commando');
const RichEmbed = require('./RichEmbed');
const Pokemon = require('./Pokemon');
const r = require('rethinkdbdash')({
  port: 28015,
  host: 'localhost',
  db: 'Pokemon'
});

module.exports = class ToastyClient extends CommandoClient {
  constructor(options) {
    super(options);
    this.session = {
      messages: 0,
      commands: 0,
      guilds: 0
    };
    this.commands = {
      pokemon: 0,
      play: 0,
      tts: 0,
      roast: 0,
      roastme: 0,
      meme: 0
    };
    this.timer = {};
    this.embed = RichEmbed;
    this.config = require('../config.json');
    this.r = r;
    this.pokemon = new Pokemon(this);
  }
};
