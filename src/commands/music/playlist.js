const { Command } = require('discord.js-commando');

module.exports = class PlaylistCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'playlist',
      group: 'music',
      memberName: 'playlist',
      description: 'Loads the queue with 15 random songs from a premade playlist.',
      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 20
      }
    });
  }

  run(msg){}
};
