const { Command } = require('discord.js-commando');

module.exports = class AdviceCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'advice',
      group: 'fun',
      memberName: 'advice',
      guildOnly: true,
      description: 'Get some advice!',
      throttling: {
        usages: 1,
        duration: 3
      }
    });
  }

  async run(msg) {
    let res = await this.client.snekfetch.get('http://api.adviceslip.com/advice');
    let advice = JSON.parse(res.body);
    try {
      const embed = new this.client.embed()
        .setAuthor('Here\'s some advice!', 'https://a.safe.moe/BVBr9.png')
        .setDescription(advice.slip.advice)
        .setColor('#727684');
      return msg.embed(embed);
    } catch (err) {
      return msg.say(`${err.name}: ${err.message}`);
    }
  }
};
