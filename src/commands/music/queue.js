const { Command } = require('discord.js-commando');

module.exports = class QueueCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'queue',
      group: 'music',
      memberName: 'queue',
      description: 'Lists the songs in the queue.',
      details: 'Add music to the queue with the `add` command.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  run(msg){}
};
