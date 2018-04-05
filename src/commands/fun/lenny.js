const { Command } = require('discord.js-commando');

module.exports = class LennyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'lenny',
      group: 'fun',
      aliases: ['( ͡° ͜ʖ ͡°)'],
      memberName: 'lenny',
      description: '( ͡° ͜ʖ ͡°)',
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  run(msg) {
    msg.say('( ͡° ͜ʖ ͡°)');
  }
};
