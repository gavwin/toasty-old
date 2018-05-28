const path = require('path');
const fs = require('fs');
const { oneLine } = require('common-tags');

exports.run = async (client) => {
  console.log(oneLine`
  Shard ${client.shard.id + 1}/${client.shard.count} ready!
  On ${client.guilds.size.toLocaleString()} guilds w/ ${client.users.size.toLocaleString()} users.`);
  client.user.setActivity(';help | toastybot.com');

  if (client.shard.id !== 9) return;

  const moment = require('moment');
  require('moment-duration-format');
  const formatUptime = time => moment.duration(time).format('D [days], H [hrs], m [mins], s [secs]');
  //setInterval(async () => {
    const shard = client.shard;
    const evalstr = `[this.shard.id, this.guilds.size, this.users.size, this.channels.size, this.voiceConnections.size, this.uptime, (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2), process.memoryUsage().heapTotal]`;
    const result = await shard.broadcastEval(evalstr);
    let guilds = result.map(r => r[1]);
    let users = result.map(r => r[2]);
    let channels = result.map(r => r[3]);
    let voiceConnections = result.map(r => r[4]);
    let uptime = result.map(r => r[5]);
    let memory = result.map(r => r[7]);

    const jsonPath = path.join(__dirname, '..', '..', 'web', 'static', 'assets', 'json', 'stats.json');
    let statsData = JSON.parse(fs.readFileSync(jsonPath));

    result.forEach((r, i) => {
      let s = (i + 1).toString();
      let data = statsData.shards[s];
      data.shard = r[0] + 1;
      data.guilds = r[1];
      data.users = r[2];
      data.channels = r[3];
      data.voiceConnections = r[4];
      data.uptime = r[5];
      data.memory = r[6];
    });
    statsData.total = {
      guilds: guilds.reduce((a, b) => a + b, 0),
      users: users.reduce((a, b) => a + b, 0),
      channels: channels.reduce((a, b) => a + b, 0),
      voiceConnections: voiceConnections.reduce((a, b) => a + b, 0),
      uptime: uptime.reduce((a, b) => a + b, 0) / shard.count,
      memory: memory.reduce((a, b) => a + b, 0)
    };
    statsData.shardCount = shard.count;
    fs.writeFileSync(jsonPath, JSON.stringify(statsData));
  //}, 30000);
};
