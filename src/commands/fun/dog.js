const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');

module.exports = class DogCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'dog',
      group: 'fun',
      memberName: 'dog',
      description: 'Sends a random dog image.',
      throttling: {
        usages: 1,
        duration: 5
      }
    });
  }

  async run(msg) {
    try {
      const { body } = await snekfetch.get('https://random.dog/woof.json');
      const embed = new this.client.embed()
        .setColor('RANDOM')
        .setImage(body.url);
      msg.embed(embed);
      //return msg.say({ files: [body.url] }).catch(err => msg.say(`${err.name}: ${err.message}`));
    } catch (err) {
      return msg.say(`${err.name}: ${err.message}`);
    }
  }
};
