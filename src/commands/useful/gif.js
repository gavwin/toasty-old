const { Command } = require('discord.js-commando');

module.exports = class GifCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'gif',
      group: 'useful',
      aliases: ['giphy'],
      memberName: 'gif',
      description: 'Searches for a gif on giphy.',
      args: [
        {
          key: 'query',
          prompt: 'What gif would you like to search for?\n',
          type: 'string'
        }
      ],
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  async run(msg, args) {
    const gif = args.query.replace(' ', '-');
    const m = await msg.say('*Searching...*');
    setTimeout(() => {
      m.edit(`:clapper: **${msg.author.username}**, http://giphy.com/search/${gif}`);
    }, 750);
  }
};
