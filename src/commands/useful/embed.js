const { Command } = require('discord.js-commando');

module.exports = class EmbedCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'embed',
      group: 'useful',
      memberName: 'embed',
      description: 'Embeds the text you provide.',
      examples: ['embed This message will be in an embed'],
      args: [
        {
          key: 'text',
          prompt: 'What text would you like the bot to embed?',
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
    const embed = new this.client.embed();
    embed.setColor('RANDOM')
      .setAuthor(msg.author.username, msg.author.avatarURL())
      .setDescription(args.text);
    msg.embed(embed);
  }
};
