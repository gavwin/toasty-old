const { Command } = require('discord.js-commando');
const leet = require('1337');

module.exports = class LeetCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'leet',
      group: 'fun',
      memberName: 'leet',
      description: 'Translate\'s your text into leet (1337).',
      args: [
        {
          key: 'text',
          prompt: 'What would you like to translate into leet?\n',
          type: 'string'
        }
      ],
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  run(msg, args) {
    msg.say(leet(args.text));
  }
};
