const { Command } = require('discord.js-commando');

module.exports = class PlayCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'play',
      group: 'music',
      memberName: 'play',
      description: 'Joins your voice channel and starts playing the server queue.',
      details: 'Add music to the queue with the `add` command.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  run(msg) {
    this.client.commands.play++;
  }
};
