const { Command } = require('discord.js-commando');

module.exports = class ClearQueueCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'clearqueue',
      group: 'music',
      memberName: 'clearqueue',
      description: 'Clears the music queue.',
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
