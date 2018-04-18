const { Command } = require('discord.js-commando');

module.exports = class CatCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'cat',
      group: 'fun',
      memberName: 'cat',
      description: 'Sends a random image of a cat.',
      throttling: {
        usages: 1,
        duration: 5
      }
    });
  }

  async run(msg) {
    const { body } = await this.client.snekfetch.get('https://api-v2.weeb.sh/images/random?type=animal_cat')
      .set('Authorization', `Wolke ${this.client.config.weebshToken}`)
      .catch(err => msg.say(`${err.name}: ${err.message}`));
    const embed = new this.client.embed()
      .setColor('RANDOM')
      .setImage(body.url);
    msg.embed(embed);
  }
};
