exports.run = (client) => {
  console.log(`Reconnecting event fired on shard ${client.shard.id + 1}.`);
}
