/* eslint-disable capitalized-comments, max-len */
exports.run = async client => {
  client.session.guilds++;
  /* const defaultChannel = guild.channels.find(c => c.permissionsFor(client.user).has('SEND_MESSAGES'));
  defaultChannel.send(':wave: Hey there, I\'m Toasty!\nA fun, moderating, music playing and delicious multi-purpose Discord bot for all your needs!\nType, `;help` for a list of commands!\n*Info:* Some of the moderation commands such as the joinrole, modlog, joinlog, etc, require the **Administrator** permission to be used. Type, `;help set` and `;help toggle` for more info.\nIf you would like to change the prefix, you can do so with the `;prefix` command.\nIf you have any questions, please join https://discord.me/toasty, or type, `;hq`.\nThanks for inviting me!'); */
  const guildRes = await client.shard.fetchClientValues('guilds.size');
  const guilds = guildRes.reduce((prev, val) => prev + val, 0);
  client.user.setActivity(`;help | ${guilds.toLocaleString()} servers!`);

  client.snekfetch.post(`https://botlist.space/api/bots/${client.user.id}`)
    .set('Authorization', client.config.tokens.botlistspace)
    .send({
      server_count: guilds,
      shards: guildRes
    }).end();
};
