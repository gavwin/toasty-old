const { Command } = require('discord.js-commando');

module.exports = class ShardCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'shard',
      group: 'util',
      memberName: 'shard',
      description: 'Checks what shard you\'re on.',
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  run(msg) {
    msg.say(`**${msg.author.username}**, you are on shard **${this.client.shard.id + 1}/${this.client.shard.count}**.`);
  }
};
