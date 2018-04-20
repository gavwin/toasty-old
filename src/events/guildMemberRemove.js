const fs = require('fs');
const path = require('path');
/* eslint-disable max-len */
exports.run = (client, member) => {
  const { guild } = member;
  let defaultChannel;
  try {
    defaultChannel = guild.channels.find(c => c.permissionsFor(client.user).has('SEND_MESSAGES'));
  } catch (e) {
    defaultChannel = guild.channels.find(c => c.name === 'general');
  }
  const RichEmbed = client.embed;
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'servers.json')));

  if (!data[guild.id]) data[guild.id] = { 'leaveMessage': 'disabled' };
  if (data[guild.id].leaveMessage && data[guild.id].leaveMessage !== 'disabled') {
    const { leaveMessage } = data[guild.id];
    if (leaveMessage.includes('{user}')) {
      const message = leaveMessage.replace('{user}', member.user);
      if (!guild.channels.find('name', 'join-log')) return;
      guild.channels.find('name', 'join-log').send(message).catch(() => {
        defaultChannel.send(':no_entry_sign: **Error:** I couldn\'t send the leave message in the #join-log. Please make sure the join log is enabled!');
      });
    } else {
      if (!guild.channels.find('name', 'join-log')) return;
      guild.channels.find('name', 'join-log').send(leaveMessage).catch(() => {
        defaultChannel.send(':no_entry_sign: **Error:** I couldn\'t send the leave message in the #join-log. Please make sure the join log is enabled!');
      });
    }
  }

  if (!data[guild.id]) data[guild.id] = { 'joinlog': 'disabled' };
  if (data[guild.id].joinlog && data[guild.id].joinlog === 'enabled') {
    const embed = new RichEmbed();
    const today = new Date();
    const date = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
    const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
    if (member.user.bot === true) {
      embed.setColor(0xFF0000)
        .setAuthor(member.user.username, member.user.avatarURL)
        .setTitle('Bot Left:')
        .setDescription(`- ${member.user.username}#${member.user.discriminator} (${member.user.id})`)
        .setFooter(`${date} at ${time}`);
      if (!guild.me.permissions.has('EMBED_LINKS')) {
        defaultChannel.send(':no_entry_sign: **Error:** I couldn\'t send an embed in the #join-log. Please make sure I have the **Send Embeds** permission!');
        return;
      }
      if (!guild.channels.find('name', 'join-log')) return;
      guild.channels.find('name', 'join-log').send({ embed }).catch(() => {
        defaultChannel.send(':no_entry_sign: **Error:** I couldn\'t send an embed in the #join-log. Please make sure I have access to a channel called join-log!');
      });
    } else {
      embed.setColor(0xFF0000)
        .setAuthor(member.user.username, member.user.avatarURL)
        .setTitle('User Left:')
        .setDescription(`- ${member.user.username}#${member.user.discriminator} (${member.user.id})`)
        .setFooter(`${date} at ${time}`);
      if (!guild.me.permissions.has('EMBED_LINKS')) {
        defaultChannel.send(':no_entry_sign: **Error:** I couldn\'t send an embed in the #join-log. Please make sure I have the **Send Embeds** permission!');
        return;
      }
      if (!guild.channels.find('name', 'join-log')) return;
      guild.channels.find('name', 'join-log').send({ embed }).catch(() => {
        defaultChannel.send(':no_entry_sign: **Error:** I couldn\'t send an embed in the #join-log. Please make sure I have access to a channel called join-log!');
      });
    }
  }
};
