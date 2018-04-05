const { Command } = require('discord.js-commando');

module.exports = class DonateCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'donate',
      group: 'misc',
      memberName: 'donate',
      description: 'Sends the donation link to support this bot.',
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  run(msg) {
    msg.say('Donations are **__much__** appreciated. Donate here:\n**http://toastybot.com/donate**');
  }
};
