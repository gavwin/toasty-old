const { Command } = require('discord.js-commando');
const moment = require('moment');
require('moment-duration-format');

module.exports = class ShardInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'shardinfo',
      group: 'util',
      memberName: 'shardinfo',
      description: 'Sends information on each shard.',
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  async run(msg) {
    const uptimeRes = await this.client.shard.fetchClientValues('uptime');
    const uptime = uptimeRes.reduce((prev, val) => prev + val, 0);
    const averageUptime = uptime / this.client.shard.count;
    const embed = new this.client.embed();
    embed.setColor('RANDOM')
      .setAuthor(this.client.user.username, this.client.user.avatarURL)
      .setTitle('Shard Info')
      .addField('Shard:', this.client.shard.id + 1 + '/' + this.client.shard.count)
      .addField('Average Shard Uptime:', moment.duration(averageUptime).format(' D [days], H [hrs], m [mins], s [secs]'));

    uptimeRes.forEach((time, i) => {
      embed.addField(`Shard ${i + 1} Uptime:`, moment.duration(time).format(' D [days], H [hrs], m [mins], s [secs]'));
    });

    msg.embed(embed);
  }
};
