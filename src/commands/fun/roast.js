const { Command } = require('discord.js-commando');
const path = require('path');
const roasts = require(path.join(__dirname, '..', '..', 'data', 'roasts.json'));

module.exports = class RoastCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'roast',
      group: 'fun',
      aliases: ['insult'],
      memberName: 'roast',
      description: 'Roasts/insults the mentioned user.',
      guildOnly: true,
      args: [
        {
          key: 'thing',
          prompt: 'Who would you like to roast?\n',
          type: 'string'
        }
      ],
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  run(msg, { thing }) {
    if (thing.toLowerCase().includes('toasty') || thing.includes('<@208946659361554432>')) return msg.reply(':fire: Listen up you dumbass retard! I ain\'t gonna roast myself!');
    if (msg.content.toLowerCase().startsWith(`${this.client.commandPrefix}roastme`) || msg.content.toLowerCase().startsWith(`${this.client.commandPrefix}roast me`)) return msg.say(`**${msg.author.username}**, :fire: ${this.client.randomArray(roasts)}`);
    msg.say(`**${thing}**, :fire: ${this.client.randomArray(roasts)}`);
  }
};
