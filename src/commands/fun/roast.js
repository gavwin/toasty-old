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

  run(msg, args) {
    this.client.commands.roast++;
    const { thing } = args;
    if (thing.toLowerCase().includes('toasty') || thing.includes('<@208946659361554432>')) return msg.reply(':fire: Listen up you dumbass retard! I ain\'t gonna roast myself!');
    if (thing.toLowerCase().startsWith('me')) return msg.say(`**${msg.author.username}**, :fire: ${roasts[Math.floor(Math.random() * roasts.length)]}`);
    msg.say(`**${thing}**, :fire: ${roasts[Math.floor(Math.random() * roasts.length)]}`);
  }
};
