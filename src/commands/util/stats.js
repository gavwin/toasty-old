const { Command } = require('discord.js-commando');
const os = require('os');

module.exports = class StatsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'stats',
      group: 'util',
      memberName: 'stats',
      description: 'Sends detailed statistics of the bot.',
      throttling: {
        usages: 1,
        duration: 15
      }
    });
  }

  async run(msg) {
    const client = this.client;
    const m = await msg.say('*Fetching my stats...*');

    let uptime = await client.shard.fetchClientValues('uptime');
    let avgUptime = uptime.reduce((a, b) => a + b, 0) / client.shard.count;

    const memory = await client.shard.broadcastEval('process.memoryUsage().heapTotal');
    let memoryUsage = (memory.reduce((a, b) => a + b, 0) / 1024 / 1024).toFixed(2);

    let CPUUsage = await getCPUUsage();

    const data = [
      `Servers: **${await getTotal(client, 'guilds.size')}**`,
      `Users: **${await getTotal(client, 'users.size')}**`,
      `Channels: **${await getTotal(client, 'channels.size')}**`,
      `Voice Channels: **${await getTotal(client, 'voiceConnections.size')}**`,
      `Average Shard Uptime: **${client.formatUptime(avgUptime)}**`,
      `Messages This Session: **${await getTotal(client, 'session.messages')}**`,
      `Commands This Session: **${await getTotal(client, 'session.commands')}**`,
      `Guilds This Session: **${await getTotal(client, 'session.guilds')}**`,
      `Pokemon Caught This Session: **${await getTotal(client, 'session.pokemon')}**`,
      `Discord Latency: **${Math.round(client.ping)}** MS`,
      `Message Latency: **${m.createdTimestamp - msg.createdTimestamp}** MS`,
      `Memory Usage: **${memoryUsage} / ${(os.totalmem() / 1024 / 1024).toFixed(2)}** MB`,
      `Shard Swap Size: **${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}** MB`,
      `CPU Usage: **${CPUUsage.toFixed(1)}%**`,
      'Operating System: **Ubuntu 14.04 Server**',
      `Node.js Version: **${process.version}**`,
      'Creator: **i am toast**#1213'
    ];

    const embed = new client.embed()
      .setColor('RANDOM')
      .setAuthor(`${client.user.username} Stats`, client.user.avatarURL())
      .setDescription(data.join('\n'));
    m.edit({ embed });
  }
};

const getTotal = async (client, value) => {
  let val = await client.shard.fetchClientValues(value);
  return val.reduce((a, b) => a + b, 0).toLocaleString();
}

const getCPUUsage = async () => {
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  let [timeUsed0, timeIdle0, timeUsed1, timeIdle1] = new Array(4).fill(0);

  const cpu0 = os.cpus();
  await sleep(1000);
  const cpu1 = os.cpus();

  for (const cpu of cpu1) {
    timeUsed1 += (
      cpu.times.user +
      cpu.times.nice +
      cpu.times.sys
    )
    timeIdle1 += cpu.times.idle;
  }
  for (const cpu of cpu0) {
    timeUsed0 += (
      cpu.times.user +
      cpu.times.nice +
      cpu.times.sys
    )
    timeIdle0 += cpu.times.idle;
  }

  const totalUsed = timeUsed1 - timeUsed0;
  const totalIdle = timeIdle1 - timeIdle0;
  return (totalUsed / (totalUsed + totalIdle)) * 100;
}
