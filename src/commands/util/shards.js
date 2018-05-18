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
    const evalstr = `[this.shard.id, this.guilds.size, this.users.size, this.channels.size, this.voiceConnections.size, this.uptime, (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2), process.memoryUsage().heapTotal]`;
    const shard = this.client.shard;
    const result = await shard.broadcastEval(evalstr);

    let guilds = result.map(r => r[1]);
    let users = result.map(r => r[2]);
    let channels = result.map(r => r[3]);
    let voiceConnections = result.map(r => r[4]);
    let uptime = result.map(r => r[5]);
    let memory = result.map(r => r[7]);
    let totalMemory = (memory.reduce((a, b) => a + b, 0) / 1024 / 1024).toFixed(2);
    let avgUptime = uptime.reduce((a, b) => a + b, 0) / shard.count;

    const shards = `${result.map(r => `${r[0]+1} : G ${r[1]}, U ${r[2]}, C ${r[3]}, VC ${r[4]}, UP ${formatUptime(r[5])}, M ${r[6]}`).join('\n')}`;
    const total = `T : G ${guilds.reduce((a, b) => a + b, 0)}, U ${users.reduce((a, b) => a + b, 0)}, C ${channels.reduce((a, b) => a + b, 0)}, VC ${voiceConnections.reduce((a, b) => a + b, 0)}, UP ${formatUptime(avgUptime)}, M ${totalMemory}`;

    msg.channel.send(`= Shard Information =\n${shards}\n${total}`, { code: 'prolog'});
  }
};
