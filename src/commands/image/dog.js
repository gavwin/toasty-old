const { Command } = require('discord.js-commando');

module.exports = class DogCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'dog',
      group: 'image',
      memberName: 'dog',
      description: 'Sends a random dog image.',
      throttling: {
        usages: 1,
        duration: 5
      }
    });
  }

  async run(msg) {
    const { body } = await this.client.snekfetch.get('https://api-v2.weeb.sh/images/random?type=animal_dog')
      .set('Authorization', `Wolke ${this.client.config.tokens.weebsh}`)
      .catch(err => msg.say(`${err.name}: ${err.message}`));
    const embed = new this.client.embed()
      .setColor('RANDOM')
      .setImage(body.url);
    msg.embed(embed);
  }
};
