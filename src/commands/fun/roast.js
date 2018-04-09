const { Command } = require('discord.js-commando');
const path = require('path');
const roasts = require(path.join(__dirname, '..', '..', 'data', 'roasts.json'));
const saferoasts = roasts.safe;
const allroasts = roasts.safe.concat(roasts.nsfw);

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
    if (msg.channel.nsfw) {
      if (thing.toLowerCase().includes('toasty') || thing.includes('<@208946659361554432>')) return msg.reply(':fire: Listen up you dumbass retard! I ain\'t gonna roast myself!');
      if (thing.toLowerCase().includes('me')) return msg.say(`**${msg.author.username}**, :fire: ${allroasts[Math.floor(Math.random() * allroasts.length)]}`);
      msg.say(`**${thing}**, :fire: ${allroasts[Math.floor(Math.random() * allroasts.length)]}`);
    } else {
      if (thing.toLowerCase().includes('toasty') || thing.includes('<@208946659361554432>')) return msg.reply(':fire: Listen up, stupid! I ain\'t gonna roast myself!');
      if (thing.toLowerCase().includes('me')) return msg.say(`**${msg.author.username}**, :fire: ${saferoasts[Math.floor(math.random() * saferoasts.length)]}`);
      msg.say(`**${thing}**, :fire: ${saferoasts[Math.floor(Math.random() * saferoasts.length)]}`);
    }
  }
};
