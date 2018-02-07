const { Command } = require('discord.js-commando');

module.exports = class ServersCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'servers',
      group: 'util',
      aliases: ['guilds'],
      memberName: 'servers',
      description: 'Sends how many servers the bot is on.',
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  async run(msg) {
    const guilds = await this.client.shard.fetchClientValues('guilds.size');
    msg.say(`I'm on **${guilds.reduce((prev, val) => prev + val, 0).toLocaleString()}** servers!`);
  }
};
