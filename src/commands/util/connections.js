const { Command } = require('discord.js-commando');

module.exports = class ConnectionsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'connections',
      group: 'util',
      aliases: ['voiceconnections', 'vcs'],
      memberName: 'connections',
      description: 'Sends the amount of voice channels the bot is connected to.',
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  async run(msg) {
    const connections = await this.client.shard.fetchClientValues('voiceConnections.size');
    msg.say(`:notes: Currently playing some *toasty* music in **${connections.reduce((prev, val) => prev + val, 0)}** voice channels.`)
  }
}
