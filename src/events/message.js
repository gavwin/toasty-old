const { tokens } = require('../config.json');
const indico = require('indico.io');
const url = require('url');
const { stripIndents } = require('common-tags');

exports.run = async (client, msg) => {
  const RichEmbed = client.embed;
  client.session.messages++;
  if (msg.channel.type === 'dm') return;

  if (msg.content.toLowerCase().startsWith(';updates') && msg.guild.id === '208674478773895168') {
    const role = msg.guild.roles.find('name', 'Updates');
    if (msg.member.roles.has(role.id)) {
      msg.member.roles.remove(role).catch(e => { msg.reply(e); });
      msg.reply('<:red_check_mark:447576694845603840> You will no longer recieve updates about Toasty on this server.');
    } else if (!msg.member.roles.has(role.id)) {
      msg.member.roles.add(role).catch(e => { msg.reply(e); });
      msg.reply(':white_check_mark: You will now recieve updates about Toasty on this server.');
    }
  }

  const settings = await client.database.getData(msg.guild.id);

  /*if (settings.nonsfw === 'enabled' && msg.attachments) {
    const urls = msg.attachments
      .map(a => a.url)
      .concat(msg.content.split(' ')
        .map(x => url.parse(x))
        .filter(x => x.hostname)
        .map(x => url.format(x)));
    for (const URL of urls) {
      indico.contentFiltering(URL, { apiKey: tokens.indico })
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
  }*/

  // console.log(/discord(?:app\.com|\.gg)[\/invite\/]?(?:(?!.*[Ii10OolL]).[a-zA-Z0-9]{5,6}|[a-zA-Z0-9\-]{2,32})/g.test(msg.content.toLowerCase()));
  if (
    /(discord\.gg\/.+|discordapp\.com\/invite\/.+)/i.test(msg.content.toLowerCase())
      && settings.noinvite === 'enabled'
      && msg.author.id !== client.user.id
  ) {
    if (msg.author.id === msg.guild.ownerID || client.isOwner(msg.author)) return;
    if (msg.author.id === '330488924449275916') return; //pokebot
    if (!msg.guild.me.permissions.has('MANAGE_MESSAGES')) {
      msg.channel.send(':no_entry_sign: **Error:** I could not delete a discord invite because I do not have the **Manage Messages** permission!');
    } else {
      await msg.delete().catch(err => msg.reply(':no_entry_sign: There is no invite link sending allowed on this server!'));
      msg.reply(':no_entry_sign: There is no invite link sending allowed on this server!');
      if (settings.modlog === 'enabled') {
        const embed = new RichEmbed();
        const today = new Date();
        const date = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
        const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
        const channel = msg.guild.channels.find('name', 'mod-log').id;
        embed.setColor(0xADD8E6)
          .setAuthor(`${msg.author.username} (${msg.author.id})`, msg.author.avatarURL())
          .setDescription(stripIndents`
            **Invite by ${msg.author.tag} deleted in ${msg.channel.toString()}**
          `)
          .setFooter(`${date} at ${time}`);
        // eslint-disable-next-line max-len
        client.channels.get(channel).send({ embed }).catch(() => msg.reply(':no_entry_sign: **Error:** I couldn\'t send an embed in the #mod-log. Please make sure I have access to a channel called mod-log!'));
      }
    }
  }
};
