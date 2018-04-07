const { Command } = require('discord.js-commando');

module.exports = class AvatarCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'avatar',
      group: 'info',
      aliases: ['profile'],
      memberName: 'avatar',
      description: 'Sends the avatar of you or the mentioned user.',
      examples: ['avatar', 'avatar @user'],
      args: [
        {
          key: 'user',
          prompt: 'What user\'s avatar would you like to get?\n',
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
    msg.say(`Avatar for, **${user.username}**:\n${user.avatarURL()}`);
  }
};
