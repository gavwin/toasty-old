const { Command } = require('discord.js-commando');

module.exports = class PingCommand extends Command {
  constructor(client) {
      super(client, {
        name: 'ping',
        group: 'util',
        memberName: 'ping',
        description: 'Checks the bot\'s ping.',
        throttling: {
          usages: 2,
          duration: 3
        }
      });
  }

  run(msg) {
		msg.say(`:ping_pong: Pong! **${this.client.ping.toFixed(0)}**ms`);
	}
};
