const { CommandoClient } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const Database = require('./Database');
const Pokemon = require('./Pokemon');
const r = require('rethinkdbdash')({
  port: 28015,
  host: 'localhost'
});

module.exports = class ToastyClient extends CommandoClient {
  constructor(options) {
    super(options);
    this.session = {
      messages: 0,
      commands: 0,
      guilds: 0,
      pokemon: 0
    };
    this.commands = {};
    this.timer = {};
    this.embed = MessageEmbed;
    this.config = require('../config.json');
    this.snekfetch = require('snekfetch');
    this.donators = require('../data/donators.json');
    this.staff = require('../data/staff.json');
    this.randomArray = (array) => {
      return array[Math.floor(Math.random() * array.length)];
    };
    this.formatUptime = (ms) => {
      const moment = require('moment');
      require('moment-duration-format');
      return moment.duration(ms).format(' D [days], H [hrs], m [mins], s [secs]');
    };
    this.r = r;
    this.database = new Database(this);
    this.pokemon = new Pokemon(this);
  }
};
