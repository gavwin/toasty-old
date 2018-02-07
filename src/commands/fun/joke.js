const { Command } = require('discord.js-commando');
const knockknock = require('knock-knock-jokes');

module.exports = class JokeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'joke',
      group: 'fun',
      aliases: ['knockknock', 'kkjoke'],
      memberName: 'joke',
      description: 'Sends a knock-knock joke.',
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  async run(msg) {
    const joke = await knockknock();
    msg.say(`**${msg.author.username}**, ${joke}`);
  }
}
