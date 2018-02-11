const { Command } = require('discord.js-commando');

module.exports = class SusersCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'susers',
      group: 'info',
      aliases: ['serverusers', 'membercount', 'usercount'],
      memberName: 'susers',
      description: 'Sends the amount of users on the server.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  run(msg) {
    msg.say(`There are **${msg.guild.memberCount.toLocaleString()}** members on this server.`);
  }
};
