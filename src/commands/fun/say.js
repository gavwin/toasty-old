const { Command } = require('discord.js-commando');

module.exports = class SayCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'say',
      aliases: ['echo'],
      group: 'fun',
      memberName: 'say',
      description: 'Says what you specified.',
      examples: ['say hello world!'],
      args: [
        {
          key: 'text',
          prompt: 'What text would you like me to say?',
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
    msg.say(args.text);
  }
};
