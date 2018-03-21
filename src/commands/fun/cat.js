const { Command } = require('discord.js-commando');
const snekfetch = require('snekfetch');

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
  if (msg.channel.type !== 'dm')
    if (!msg.channel.permissionsFor(this.client.user).has('ATTACH_FILES')) return msg.say(':no_entry_sign: I don\'t have the **Attach Files** permission!');
    try {
      const { body } = await snekfetch
        .get('http://aws.random.cat/meow');
      const embed = new this.client.embed()
        .setColor('RANDOM')
        .setImage(body.file);
      msg.embed(embed);
      //return msg.say({ files: [body.file] }).catch(err => msg.say(`${err.name}: ${err.message}`));
    } catch (err) {
      return msg.say(`${err.name}: ${err.message}`);
    }
  }
};
