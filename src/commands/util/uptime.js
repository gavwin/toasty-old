const { Command } = require('discord.js-commando');
const moment = require('moment');
require('moment-duration-format');

module.exports = class UptimeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'uptime',
      group: 'util',
      memberName: 'uptime',
      description: 'Gives the bot\'s uptime.',
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  run(msg) {
    msg.say(`:chart_with_upwards_trend: I've been online for **${moment.duration(this.client.uptime).format(' D [days], H [hrs], m [mins], s [secs]')}**.`);
  }
};
