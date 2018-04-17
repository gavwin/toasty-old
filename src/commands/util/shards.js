const { Command } = require('discord.js-commando');
const moment = require('moment');
require('moment-duration-format');

const formatUptime = time => moment.duration(time).format('D [days], H [hrs], m [mins], s [secs]');

module.exports = class ShardsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'shards',
      group: 'util',
      memberName: 'shards',
      aliases: ['shardinfo'],
      description: 'Sends information on each shard.',
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  async run(msg) {
    const evalstr = `[this.shard.id, this.guilds.size, this.channels.size, this.users.size, (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2), this.voiceConnections.size, this.uptime]`;
    const shard = this.client.shard;
    const result = await shard.broadcastEval(evalstr);
    const values = {
      guilds: await shard.fetchClientValues('guilds').reduce((prev, val) => prev + val, 0),
      channels: await shard.fetchClientValues('channels').reduce((prev, val) => prev + val, 0),
      users: await shard.fetchClientValues('users').reduce((prev, val) => prev + val, 0),
      voiceConnections: await shard.fetchClientValues('voiceConnections').reduce((prev, val) => prev + val, 0),
      uptime: await shard.fetchClientValues('uptime').reduce((prev, val) => prev + val, 0)
    }
    const avgUptime = values.uptime / shard.count;

    const total = `T : G ${values.guilds}, C ${values.channels}, U ${values.users}, VC ${values.voiceConnections}, M ${'N/A'}, UP: ${moment.duration(avgUptime).format}`;
    msg.channel.send(`= Shards Information =\n${result.map(r => `${r[0]+1} : G ${r[1]}, C ${r[2]}, U ${r[3]}, VC ${r[5]}, M ${r[4]}, UP: ${formatUptime(r[6])}`).join('\n')}\n${total}`, { code: 'prolog'});
  }
};
