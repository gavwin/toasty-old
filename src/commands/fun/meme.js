const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');

module.exports = class MemeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'meme',
      group: 'fun',
      memberName: 'meme',
      description: 'Sends a random meme.',
      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 3
      }
    });
  }

  async run(msg) {
    this.client.commands.meme++;
    const meme = Math.floor(Math.random() * (1309999 - 1290000 + 1) + 1290000);
    const embed = new this.client.embed().setColor('RANDOM').setImage(`http://images.memes.com/meme/${meme}`);
    msg.embed(embed);
  }
};
