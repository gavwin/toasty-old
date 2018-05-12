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
    if (msg.guild.emojis.size === 0) {
      return msg.say('There are no emojis on this server.');
    }
    else if (msg.guild.emojis.map(e => e).join(' ').length > 1960) {
      let s = msg.guild.emojis.map(e => e).join(' ');
      let i = Math.ceil(s.length / 2);
      let partOne = s.slice(0, i).trim();
      let partTwo = s.slice(i + 1, s.length).trim();
      msg.say(`Emojis on **${msg.guild.name}**:\n${partOne}`);
      msg.say(partTwo);
    }
    else {
      msg.say(`Emojis on **${msg.guild.name}**:\n${msg.guild.emojis.map(e => e).join(' ')}`);
    }
  }
};
