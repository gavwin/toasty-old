const { Command } = require('discord.js-commando');
const path = require('path');

module.exports = class InviteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'invite',
      group: 'util',
      aliases: ['oauth'],
      memberName: 'invite',
      description: 'Sends the invite oauth to add me to your server.',
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  run(msg) {
    msg.say(`**${msg.author.username}**, You can invite me to your server with this!\n**https://toastybot.com/invite**`);
  }
};
