const { Command } = require('discord.js-commando');
const generator = require('insult-compliment');

module.exports = class ComplimentCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'compliment',
      group: 'fun',
      memberName: 'compliment',
      description: 'Compliments the mentioned user.',
      guildOnly: true,
      args: [
        {
          key: 'thing',
          prompt: 'Who would you like to compliment?\n',
          type: 'string'
        }
      ],
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  run(msg, args) {
    const { thing } = args;
    const emojis = [':smile:', ':wink:', ':yum:', ':ok_hand:', ':blush:', ':innocent:', ':grinning:', ':stuck_out_tongue_winking_eye:'];
    msg.say(`**${thing}**, ${this.client.randomArray(emojis)} ${generator.Compliment()}`);
  }
};
