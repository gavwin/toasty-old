const { Command } = require('discord.js-commando');

module.exports = class AddCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'add',
      group: 'music',
      memberName: 'add',
      description: 'Adds a song to the queue.',
      details: 'You can specify either a song name or YouTube video / playlist URL.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  run(msg){}
};
