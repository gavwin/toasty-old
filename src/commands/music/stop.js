const { Command } = require('discord.js-commando');

module.exports = class StopCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'stop',
      group: 'music',
      memberName: 'stop',
      description: 'Stops playing, clears the queue and leaves the voice channel.',
      details: 'Can only be used when the bot is playing in a voice channel.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  run(msg){}
};
