const { Command } = require('discord.js-commando');
const path = require('path');
const roasts = require(path.join(__dirname, '..', '..', 'data', 'roasts.json'));
const saferoasts = roasts.safe;
const allroasts = roasts.safe.concat(roasts.nsfw);

module.exports = class RoastMeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'roastme',
      group: 'fun',
      aliases: ['insultme', 'toastme'],
      memberName: 'roastme',
      description: 'Roasts/insults you.',
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  run(msg) {
    this.client.commands.roastme++;
    if (msg.channel.nsfw) {
      msg.say(`**${msg.author.username}**, :fire: ${allroasts[Math.floor(Math.random() * allroasts.length]}`);
    } else {
      msg.say(`**${msg.author.username}**, :fire: ${saferoasts[Math.floor(Math.random() * saferoasts.length)]}`);
    }
  }
};
