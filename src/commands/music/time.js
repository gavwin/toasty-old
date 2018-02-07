const { Command } = require('discord.js-commando');

module.exports = class TimeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'time',
      group: 'music',
      memberName: 'time',
      description: 'Shows how long the song has been playing.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  run(msg){}
};
