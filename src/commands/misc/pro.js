const { Command } = require('discord.js-commando');

module.exports = class ProCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'pro',
      group: 'misc',
      memberName: 'pro',
      description: 'Allows you to invite Toasty Pro if you are a donator.'
    });
  }

  run(msg) {
    const embed = new this.client.embed()
      .setTitle('Toasty Pro')
      .setDescription(`Invite Toasty Pro **[here](http://toastybot.com/pro?id=${msg.author.id}&name=${encodeURIComponent(msg.author.username)}&avatar=${msg.author.avatarURL()})**`)
      .setFooter('You may only invite Toasty Pro if you are a donator.')
    msg.embed(embed);
  }
};
