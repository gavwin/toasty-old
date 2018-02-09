const snekfetch = require('snekfetch');
const fs = require('fs');
const path = require('path');
//const jsonPath = path.join(__dirname, '..', '..', 'web', 'static', 'assets', 'json', 'stats.json');
//const statsData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

exports.run = async (client, guild) => {
  client.session.guilds++;
  const { discordbotsToken, discordpwToken } = client.config;
  /*const defaultChannel = guild.channels.find(c => c.permissionsFor(client.user).has('SEND_MESSAGES'));
  defaultChannel.send(':wave: Hey there, I\'m Toasty!\nA fun, moderating, music playing and delicious multi-purpose Discord bot for all your needs!\nType, `;help` for a list of commands!\n*Info:* Some of the moderation commands such as the joinrole, modlog, joinlog, etc, require the **Administrator** permission to be used. Type, `;help set` and `;help toggle` for more info.\nIf you would like to change the prefix, you can do so with the `;prefix` command.\nIf you have any questions, please join https://discord.me/toasty, or type, `;hq`.\nThanks for inviting me!');*/
  const guildRes = await client.shard.fetchClientValues('guilds.size');
  const guilds = guildRes.reduce((prev, val) => prev + val, 0);
  client.user.setPresence({ game: { name: `;help | ${guilds.toLocaleString()} servers!`, type: 0 } });

  /*snekfetch.post(`https://discordbots.org/api/bots/${client.user.id}/stats`)
    .set('Authorization', discordbotsToken)
    .send({
      server_count: client.guilds.size,
      shard_id: client.shard.id,
      shard_count: client.shard.count
    }).end();

  snekfetch.post(`https://bots.discord.pw/api/bots/${client.user.id}/stats`)
    .set('Authorization', discordpwToken)
    .send({
      server_count: client.guilds.size,
      shard_id: client.shard.id,
      shard_count: client.shard.count
    }).end();*/

    const total = new Array();
    const users = await client.shard.fetchClientValues('users.size');
    const channels = await client.shard.fetchClientValues('channels.size');
    const voiceConnections = await client.shard.fetchClientValues('voiceConnections.size');
    total.push(guilds);
    total.push(users.reduce((prev, val) => prev + val, 0));
    total.push(channels.reduce((prev, val) => prev + val, 0));
    total.push(voiceConnections.reduce((prev, val) => prev + val, 0));
    if (!statsData) statsData = {
      "servers": 0,
      "users": 0,
      "channels": 0,
      "voiceConnections": 0
    };
    /*statsData.servers = total[0];
    statsData.users = total[1];
    statsData.channels = total[2];
    statsData.voiceConnections = total[3];*/
    //fs.writeFileSync(jsonPath, JSON.stringify(statsData, null, 2));
}
