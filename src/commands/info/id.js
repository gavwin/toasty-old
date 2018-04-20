const { Command } = require('discord.js-commando');

module.exports = class IDCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'id',
      group: 'info',
      aliases: ['userid'],
      memberName: 'id',
      description: 'Sends the ID of you or the mentioned user.',
      examples: ['id', 'id @user'],
      args: [
        {
          key: 'user',
          prompt: 'What user\'s ID would you like to get?\n',
          type: 'user',
          default: ''
        }
      ],
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  run(msg, args) {
    const user = args.user || msg.author;
    msg.channel.send(`:id: for **${user.username} :** \`${user.id}\``);
  }
};
