exports.run = async (client) => {
  console.log(`Shard ${client.shard.id + 1}/${client.shard.count} ready! On ${client.guilds.size.toLocaleString()} guilds w/ ${client.users.size.toLocaleString()} users.`);
  const guilds = await client.shard.fetchClientValues('guilds.size');
  client.user.setPresence({ game: { name: `;help ;invite | ${guilds.reduce((prev, val) => prev + val, 0).toLocaleString()} servers!`, type: 0 } });
  setInterval(() => { client.user.setGame('toastybot.com') }, 2700000);
}
