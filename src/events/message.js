const { indicoToken, prefix } = require('../config.json');
const indico = require('indico.io');
const path = require('path');
const fs = require('fs');
const url = require('url');
const { stripIndents } = require('common-tags');

exports.run = (client, msg) => {
  const RichEmbed = client.embed;
  client.session.messages++;
  if (msg.channel.type === 'dm') return;

  const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'servers.json'), 'utf8'));
  const settings = data[msg.guild.id] ? data[msg.guild.id] : { nonsfw: 'disabled', noinvite: 'disabled', nomemedog: 'disabled' };

  if (settings.nonsfw === 'enabled' && msg.attachments) {
    const urls = msg.attachments
      .map(a => a.url)
      .concat(msg.content.split(' ')
        .map(x => url.parse(x))
        .filter(x => x.hostname)
        .map(x => url.format(x)));
    for (const URL of urls) {
      indico.contentFiltering(URL, { apiKey: indicoToken })
        .then(res => {
          if (typeof res !== 'number' || res < 0.93) return;
          if (!msg.guild.member(client.user).permissions.has('MANAGE_MESSAGES')) {
            msg.channel.send(':no_entry_sign: **Error:** I could not delete NSFW content because I do not have the **Manage Messages** permission!');
            return;
          }
          msg.delete().then(() => msg.reply(':no_entry_sign: There is no NSFW content allowed on this server!'));
          if (settings.modlog === 'enabled') {
            const embed = new RichEmbed();
            const today = new Date();
            const date = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
            const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
            const channel = msg.guild.channels.find('name', 'mod-log').id;
            embed.setColor(0xADD8E6)
              .setAuthor(msg.author.username, msg.author.avatarURL)
              .setTitle('NSFW Content Deleted:')
              .setDescription(`${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`)
              .setFooter(`${date} at ${time}`);
            // eslint-disable-next-line max-len
            client.channels.get(channel).send({ embed }).catch(() => msg.reply(':no_entry_sign: **Error:** I couldn\'t send an embed in the #mod-log. Please make sure I have access to a channel called mod-log!'));
          }
        }).catch(() => null);
    }
  }

  // console.log(/discord(?:app\.com|\.gg)[\/invite\/]?(?:(?!.*[Ii10OolL]).[a-zA-Z0-9]{5,6}|[a-zA-Z0-9\-]{2,32})/g.test(msg.content.toLowerCase()));
  // console.log(settings.noinvite);
  if (
    /(discord\.gg\/.+|discordapp\.com\/invite\/.+)/i.test(msg.content.toLowerCase())
      && settings.noinvite === 'enabled'
      && msg.author.id === client.user.id
      && !client.isOwner(msg.author)
  ) {
    //if (msg.author.id === msg.guild.ownerID || client.isOwner(msg.author)) return;
    if (!msg.guild.me.permissions.has('MANAGE_MESSAGES')) {
      msg.channel.send(':no_entry_sign: **Error:** I could not delete a Discord invite because I do not have the **Manage Messages** permission!');
    } else {
      msg.delete().then(() => msg.reply(':no_entry_sign: There is no invite link sending allowed on this server!'));
      if (settings.modlog === 'enabled') {
        const embed = new RichEmbed();
        const today = new Date();
        const date = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
        const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
        const channel = msg.guild.channels.find('name', 'mod-log').id;
        embed.setColor(0xADD8E6)
          .setAuthor(`${msg.author.username} (${msg.author.id})`, msg.author.avatarURL)
          .setDescription(stripIndents`
            **Invite by ${msg.author.tag} deleted in ${msg.channel.toString()}**
          `)
          .setFooter(`${date} at ${time}`);
        // eslint-disable-next-line max-len
        client.channels.get(channel).send({ embed }).catch(() => msg.reply(':no_entry_sign: **Error:** I couldn\'t send an embed in the #mod-log. Please make sure I have access to a channel called mod-log!'));
      }
    }
  }

  if (msg.content.includes('This is memedog.')
    && msg.content.includes('Help memedog take over Discord by pasting in 10 other servers or he will never be a meme dog')
    && settings.nomemedog === 'enabled') {
    if (!msg.guild.me.permissions.has('MANAGE_MESSAGES')) {
      msg.channel.send(':no_entry_sign: **Error:** I could not delete memedog because I do not have the **Manage Messages** permission!');
    } else {
      msg.delete().then(() => msg.reply(':no_entry_sign: There is no memedog allowed on this server!'));
    }
  }
};
