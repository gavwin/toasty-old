const { Command } = require('discord.js-commando');

module.exports = class JokeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'joke',
      group: 'fun',
      aliases: ['dadjoke'],
      memberName: 'joke',
      description: 'Sends a random dad joke.',
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  async run(msg) {
    const { body } = await this.client.snekfetch.get('https://icanhazdadjoke.com/')
      .set('Accept', 'application/json')
      .catch(err => msg.say(`${err.name}: ${err.message}`));
    msg.say(`**${msg.author.username}**, ${body.joke}`);
  }
};
