const fs = require('fs');
const path = require('path');

exports.run = (client, member) => {
  const RichEmbed = client.embed;
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'servers.json')));
  const guild = member.guild;

  if (!data[guild.id]) data[guild.id] = {"leaveMessage": "disabled"};
  if (data[guild.id].leaveMessage && data[guild.id].leaveMessage !== 'disabled') {
    let leaveMessage = data[guild.id].leaveMessage;
    if (leaveMessage.includes('{user}')) {
      let message = leaveMessage.replace('{user}', member.user);
      if (!guild.channels.find('name', 'join-log')) return;
      guild.channels.find('name', 'join-log').send(message).catch(err => {
        return msg.channel.send(':no_entry_sign: **Error:** I couldn\'t send the leave message in the #join-log. Please make sure the join log is enabled!');
      });
    } else {
      if (!guild.channels.find('name', 'join-log')) return;
      guild.channels.find('name', 'join-log').send(leaveMessage).catch(err => {
        return msg.channel.send(':no_entry_sign: **Error:** I couldn\'t send the leave message in the #join-log. Please make sure the join log is enabled!');
      });
    }
  }

  if (!data[guild.id]) data[guild.id] = {"joinlog": "disabled"};
  if (data[guild.id].joinlog && data[guild.id].joinlog === 'enabled') {
    let embed = new RichEmbed();
    let today = new Date();
    let date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
    let time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    if (member.user.bot === true) {
      embed.setColor(0xFF0000)
           .setAuthor(member.user.username, member.user.avatarURL)
           .setTitle('Bot Left:')
           .setDescription(`- ${member.user.username}#${member.user.discriminator} (${member.user.id})`)
           .setFooter(`${date} at ${time}`);
      //if (!guild.member(client.user).permissions.has('EMBED_LINKS')) return guild.defaultChannel.send(':no_entry_sign: **Error:** I couldn\'t send an embed in the #join-log. Please make sure I have the **Send Embeds** permission!');
      if (!guild.channels.find('name', 'join-log')) return;
      guild.channels.find('name', 'join-log').send({ embed }).catch(err => {
        let defaultChannel = guild.channels.find(c => c.permissionsFor(client.user).has('SEND_MESSAGES'));
        defaultChannel.send(':no_entry_sign: **Error:** I couldn\'t send an embed in the #join-log. Please make sure I have access to a channel called join-log!');
      });
    } else {
      embed.setColor(0xFF0000)
           .setAuthor(member.user.username, member.user.avatarURL)
           .setTitle('User Left:')
           .setDescription(`- ${member.user.username}#${member.user.discriminator} (${member.user.id})`)
           .setFooter(`${date} at ${time}`);
      //if (!guild.member(client.user).permissions.has('EMBED_LINKS')) return guild.defaultChannel.send(':no_entry_sign: **Error:** I couldn\'t send an embed in the #join-log. Please make sure I have the **Send Embeds** permission!');
      if (!guild.channels.find('name', 'join-log')) return;
      guild.channels.find('name', 'join-log').send({ embed }).catch(err => {
        let defaultChannel = guild.channels.find(c => c.permissionsFor(client.user).has('SEND_MESSAGES'));
        defaultChannel.send(':no_entry_sign: **Error:** I couldn\'t send an embed in the #join-log. Please make sure I have access to a channel called join-log!');
      });
    }
  }
}
