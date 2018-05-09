const { Command } = require('discord.js-commando');

module.exports = class UptimeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'uptime',
      group: 'util',
      memberName: 'uptime',
      description: 'Gives the bot\'s uptime.'
    });
  }

  run(msg) {
    msg.say(`:chart_with_upwards_trend: I've been online for **${this.client.formatUptime(this.client.uptime)}**.`);
  }
};
