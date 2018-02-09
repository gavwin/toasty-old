const { oneLine } = require('common-tags');
exports.run = async client => {
  console.log(oneLine`
    Shard ${client.shard.id + 1}/${client.shard.count} ready!
    On ${client.guilds.size.toLocaleString()} guilds w/ ${client.users.size.toLocaleString()} users.`);
  const guilds = await client.shard.fetchClientValues('guilds.size');
  client.user.setActivity(`;help ;invite | ${guilds.reduce((prev, val) => prev + val, 0).toLocaleString()} servers!`);
  setInterval(() => client.user.setActivity('toastybot.com'), 2700000);
};
