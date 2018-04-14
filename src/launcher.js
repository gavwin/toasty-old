const { ShardingManager, Util } = require('discord.js');
const { stripIndents } = require('common-tags');
const moment = require('moment');
require('moment-duration-format');
const { token, shardCount, spawnDelay, serversPerShard, autoRespawn = true } = require('./config.json');

if (shardCount === 'auto') {
  Util.fetchRecommendedShards(token, serversPerShard).then(count => {
    let time = count * spawnDelay;
    console.log('Shards launching via AUTO');
    console.log(stripIndents`
      Ready to spawn ${count.toFixed(0)} shards (${count}).
      Estimated launch time: ${moment.duration(time).format(' m [mins], s [secs]')}
    `);
    const manager = new ShardingManager(`${__dirname}/toasty.js`, { totalShards: parseInt(count.toFixed(0)), token, respawn: autoRespawn })
      .on('launch', shard => console.log(`Attempting to launch shard ${shard.id + 1} | PID: ${shard.process.pid}.`));

    manager.spawn(parseInt(count.toFixed(0)), spawnDelay)
      .catch(console.error);
  });
} else {
  let time = shardCount * spawnDelay;
  console.log('Shards launching via SET_SHARD_COUNT');
  console.log(stripIndents`
    Ready to spawn ${shardCount} shards.
    Estimated launch time: ${moment.duration(time).format(' m [mins], s [secs]')}
  `);
  const manager = new ShardingManager(`${__dirname}/toasty.js`, { totalShards: shardCount, token, respawn: autoRespawn })
    .on('launch', shard => console.log(`Attempting to launch shard ${shard.id + 1} | PID: ${shard.process.pid}.`));
  manager.spawn(shardCount, spawnDelay)
    .catch(console.error);
}
