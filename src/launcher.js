const { ShardingManager, Util } = require('discord.js');
const { stripIndents } = require('common-tags');
const { token, shardCount, spawnDelay, autoRespawn = true } = require('./config.json');

if (shardCount === 'auto') {
  Util.fetchRecommendedShards(token, 1300).then(count => {
    console.log('Shards launching via AUTO');
    console.log(stripIndents`
      Ready to spawn ${count.toFixed(0)} shards (${count}).
      Estimated launch time: ${count * parseInt(spawnDelay.toString().substring(0, 1))} seconds.
    `);
    const manager = new ShardingManager(`${__dirname}/toasty.js`, { totalShards: parseInt(count.toFixed(0)), token, respawn: autoRespawn })
      .on('launch', shard => console.log(`Attempting to launch shard ${shard.id + 1} | PID: ${shard.process.pid}.`));

    manager.spawn(parseInt(count.toFixed(0)), spawnDelay)
      .catch(console.error);
  });
} else {
  console.log('Shards launching via SET_SHARD_COUNT');
  console.log(stripIndents`
    Ready to spawn ${shardCount} shards.
    Estimated launch time: ${shardCount * parseInt(spawnDelay.toString().substring(0, 1))} seconds.
  `);
  const manager = new ShardingManager(`${__dirname}/toasty.js`, { totalShards: shardCount, token, respawn: autoRespawn })
    .on('launch', shard => console.log(`Attempting to launch shard ${shard.id + 1} | PID: ${shard.process.pid}.`));
  manager.spawn(shardCount, spawnDelay)
    .catch(console.error);
}
