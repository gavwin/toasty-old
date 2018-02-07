const { ShardingManager, Util } = require('discord.js');
const { token, shardCount, spawnDelay } = require('./config.json');

if (shardCount === 'auto') {
  Util.fetchRecommendedShards(token, guildsPerShard = 1150).then(count => {
    console.log('Shards launching via AUTO');
    console.log(`Ready to spawn ${count.toFixed(0)} shards (${count}).\nEstimated launch time: ${count * parseInt(spawnDelay.toString().substring(0, 1))} seconds.`);
    const manager = new ShardingManager(`${__dirname}/toasty.js`, { totalShards: parseInt(count.toFixed(0)), token: token });
    manager.spawn(totalShards = parseInt(count.toFixed(0)), delay = spawnDelay).catch(console.error);
    manager.on('launch', shard => console.log(`Attempting to launch shard ${shard.id + 1} | PID: ${shard.process.pid}.`));
  });
} else {
  console.log('Shards launching via SET_SHARD_COUNT');
  console.log(`Ready to spawn ${shardCount} shards.\nEstimated launch time: ${shardCount * parseInt(spawnDelay.toString().substring(0, 1))} seconds.`);
  const manager = new ShardingManager(`${__dirname}/toasty.js`, { totalShards: shardCount, token: token });
  manager.spawn(totalShards = shardCount, delay = spawnDelay).catch(console.error);
  manager.on('launch', shard => console.log(`Attempting to launch shard ${shard.id + 1} | PID: ${shard.process.pid}.`));
}
