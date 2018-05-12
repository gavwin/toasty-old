const { Command } = require('discord.js-commando');

module.exports = class LargestServersCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'largestservers',
      group: 'util',
      aliases: ['ls', 'ts', 'topservers'],
      memberName: 'largestservers',
      description: 'Sends the largest servers the bot is on.',
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  run(msg) {
    const guilds = this.client.guilds;
    const sorted = guilds.array().sort((a, b) => { return b.memberCount - a.memberCount; });
    const top10 = sorted.splice(0, 10);
    const mapped = new Array();

    top10.forEach((guild, i) => {
      mapped.push(`${i+1}. **${guild.name}**: ${guild.memberCount.toLocaleString()}`);
    });

    msg.channel.send(mapped.join('\n'));
  }
};
