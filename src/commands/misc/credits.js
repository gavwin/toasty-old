const { Command } = require('discord.js-commando');

module.exports = class CreditsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'credits',
      group: 'misc',
      memberName: 'credits',
      description: 'Gives credits for the bot.'
    });
  }

  run(msg) {
    const embed = new this.client.embed()
      .setTitle('Toasty Credits')
      .addField('Developer:', 'i am toast#1213')
      .addBlankField()
      .addField('Contributors:', 'Dutchy#8775\nOGNovuh#0003\nAceAttorneyMaster111#4489')
      .addBlankField()
      .addField('Mega Donators:', 'YTAlwaysPlug#9763\nrodcad66#0001\n아빠 [DAD]#5884')
      .addBlankField()
      .addField('Graphic Designers:', 'OP#7822')
    msg.embed(embed);
  }
};
