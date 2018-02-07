const { Command } = require('discord.js-commando');

module.exports = class EmojisCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'emojis',
      group: 'info',
      aliases: ['emotes'],
      memberName: 'emojis',
      description: 'Sends all of the emojis / emotes on the server.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  run(msg) {
    let emojis;
    if (msg.guild.emojis.size === 0) emojis = 'There are no emojis on this server.'
    else emojis = `Here are all the emojis on this server:\n${msg.guild.emojis.map(e => e).join(' ')}`;
    msg.say(emojis);
  }
}
