const fs = require('fs');
const path = require('path');

exports.run = (client, member) => {
  const RichEmbed = client.embed;
  try {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'servers.json')));
  const guild = member.guild;

  if (!data[guild.id]) data[guild.id] = {"joinDM": "disabled"};
  if (data[guild.id].joinDM && data[guild.id].joinDM !== 'disabled') member.send(data[guild.id].joinDM);

  if (!data[guild.id]) data[guild.id] = {"joinMessage": "disabled"};
  if (data[guild.id].joinMessage && data[guild.id].joinMessage !== 'disabled') {
    let joinMessage = data[guild.id].joinMessage;
    if (data[guild.id].joinMessage.includes('{user}')) {
      let message = joinMessage.replace('{user}', member.user);
      let defaultChannel = guild.channels.find(c => c.permissionsFor(client.user).has('SEND_MESSAGES'));
      if (!guild.channels.find('name', 'join-log')) return defaultChannel.send(':no_entry_sign: **Error:** I couldn\'t send the join message in the #join-log. Please make sure the join log is enabled!');
      guild.channels.find('name', 'join-log').send(message).catch(err => {
				return msg.channel.send(':no_entry_sign: **Error:** I couldn\'t send the join message in the #join-log. Please make sure the join log is enabled!');
			});
    } else {
      let defaultChannel = guild.channels.find(c => c.permissionsFor(client.user).has('SEND_MESSAGES'));
      if (!guild.channels.find('name', 'join-log')) return defaultChannel.send(':no_entry_sign: **Error:** I couldn\'t send the join message in the #join-log. Please make sure the join log is enabled!');
      guild.channels.find('name', 'join-log').send(joinMessage).catch(err => {
        return msg.channel.send(':no_entry_sign: **Error:** I couldn\'t send the join message in the #join-log. Please make sure the join log is enabled!');
      });
    }
  }

  if (!data[guild.id]) data[guild.id] = {"joinRole": "disabled", "joinlog": "disabled"};
  if (data[guild.id].joinRole && data[guild.id].joinRole !== 'disabled') {
    let joinRole = data[guild.id].joinRole;
    let role = guild.roles.find('name', joinRole);
    let defaultChannel = guild.channels.find(c => c.permissionsFor(client.user).has('SEND_MESSAGES'));
    if (!role) return defaultChannel.send(`:no_entry_sign: **Error:** Couldn't add join role. Reason: \`${joinRole}\` isn't a role on this server!`);
    if (!guild.member(client.user).permissions.has('MANAGE_ROLES')) return defaultChannel.send(':no_entry_sign: **Error:** I couldn\'t add the join role because I don\'t have the **Manage Roles** permission!');
    if (data[guild.id].joinlog) {
      if (!guild.channels.find('name', 'join-log')) return defaultChannel.send(':no_entry_sign: **Error:** I couldn\'t send an embed in the #join-log. Please make sure I have access to a channel called join-log!');
      if (member.user.bot) return guild.channels.find('name', 'join-log').send(`Didn't add the join role to **${member.user.username}** because it is a bot.`);
        member.addRole(role.id);
        guild.channels.find('name', 'join-log').send(`Added the join role of \`${joinRole}\` to **${member.user.username}**.`);
    } else if (!data[guild.id].joinlog) {
        if (member.user.bot) return;
          member.addRole(role);
      }
  }

  if (!data[guild.id]) data[guild.id] = {"joinlog": "disabled"};
  if (data[guild.id].joinlog && data[guild.id].joinlog === 'enabled') {
    let embed = new RichEmbed();
    let today = new Date();
    let date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
    let time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    if (member.user.bot) {
      embed.setColor(0x32CD32)
           .setAuthor(member.user.username, member.user.avatarURL)
           .setTitle('Bot Joined:')
           .setDescription(`+ ${member.user.username}#${member.user.discriminator} (${member.user.id})`)
           .setFooter(`${date} at ${time}`);
      let defaultChannel = guild.channels.find(c => c.permissionsFor(client.user).has('SEND_MESSAGES'));
      if (!guild.member(client.user).permissions.has('EMBED_LINKS')) return defaultChannel.send(':no_entry_sign: **Error:** I couldn\'t send an embed in the #join-log. Please make sure I have the **Send Embeds** permission!');
      if (!guild.channels.find('name', 'join-log')) return defaultChannel.send(':no_entry_sign: **Error:** I couldn\'t send an embed in the #join-log. Please make sure I have access to a channel called join-log!');
      guild.channels.find('name', 'join-log').send({ embed }).catch(err => {
				return msg.channel.send(':no_entry_sign: **Error:** I couldn\'t send an embed in the #join-log. Please make sure I have access to a channel called join-log!');
			});
    } else {
      embed.setColor(0x32CD32)
           .setAuthor(member.user.username, member.user.avatarURL)
           .setTitle('User Joined:')
           .setDescription(`+ ${member.user.username}#${member.user.discriminator} (${member.user.id})`)
           .setFooter(`${date} at ${time}`);
      let defaultChannel = guild.channels.find(c => c.permissionsFor(client.user).has('SEND_MESSAGES'));
      if (!guild.member(client.user).permissions.has('EMBED_LINKS')) return defaultChannel.send(':no_entry_sign: **Error:** I couldn\'t send an embed in the #join-log. Please make sure I have the **Send Embeds** permission!');
      if (!guild.channels.find('name', 'join-log')) return defaultChannel.send(':no_entry_sign: **Error:** I couldn\'t send an embed in the #join-log. Please make sure I have access to a channel called join-log!');
      guild.channels.find('name', 'join-log').send({ embed }).catch(err => {
				defaultChannel.send(':no_entry_sign: **Error:** I couldn\'t send an embed in the #join-log. Please make sure I have access to a channel called join-log!');
			});
    }
  }
} catch(aLotOfErrors) {
  return; //kek
}
}
