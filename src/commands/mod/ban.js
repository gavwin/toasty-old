const { Command } = require('discord.js-commando');
const { caseNumber } = require('../../util/caseNumber.js');

module.exports = class BanCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ban',
      group: 'mod',
      memberName: 'ban',
      description: 'Ban a user from the server.',
      examples: ['ban @user spamming in chat'],
      guildOnly: true,
      args: [
        {
          key: 'user',
          prompt: 'What user would you like to ban?\n',
          type: 'user'
        },
        {
          key: 'reason',
          prompt: 'What is the reason you banned this user?\n',
          type: 'string'
        }
      ]
    });
  }

  async run(msg, args) {
    const data = await this.client.database.getData(msg.guild.id);
    const { user, reason } = args;
    if (user.id === this.client.user.id) return msg.reply('I can\'t ban myself \\:P');
    if (!msg.member.permissions.has('BAN_MEMBERS') && msg.author.id !== msg.guild.ownerID) return msg.reply(':no_entry_sign: [**Invalid Permissions**]: You don\'t have the **Ban Members** permission!');
    if (!msg.guild.me.permissions.has('BAN_MEMBERS')) return msg.reply(':no_entry_sign: [**Missing Permissions**]: I don\'t have the **Ban Members** permission!');
    const member = await msg.guild.members.fetch(user).catch(() => null);
    await msg.say('Are you sure you want to ban this user?  (__y__es or __n__o)');
    await msg.embed({
      author: {
        name: `${user.username}#${user.discriminator} (${user.id})`,
        icon_url: user.avatarURL
      },
      fields: [
        {
          name: 'Reason:',
          value: reason
        }
      ],
      timestamp: new Date()
    });

    msg.channel.awaitMessages(response => ['y', 'yes', 'n', 'no', 'cancel'].includes(response.content) && response.author.id === msg.author.id, {
      max: 1,
      time: 30000
    }).then(async co => {
      if (['yes', 'y'].includes(co.first().content)) {
        const m = await msg.say('*Banning user...*');
        await msg.guild.members.ban(user, 7);
        if (data.modlog === 'disabled' || !msg.guild.channels.find('name', 'mod-log')) {
          m.edit(`**${member.user.username}**#${member.user.discriminator} has been banned.`);
        } else
        if (data.modlog === 'enabled') {
          const embed = new this.client.embed();
          const channel = msg.guild.channels.find('name', 'mod-log');
          const caseNum = await caseNumber(this.client, channel);
          embed.setColor(0xFF0000)
            .setTimestamp(new Date())
            .setAuthor(member.user.username, member.user.displayAvatarURL())
            .setDescription(`**Action:** Ban\n**Target:** ${member.user.username}#${member.user.discriminator} (${member.user.id})\n**Responsible Moderator:** ${msg.author.username}#${msg.author.discriminator} (${msg.author.id})\n**Reason:** ${reason}`)
            .setFooter(`Case ${caseNum}`);
          channel.send({ embed }).catch(err => msg.reply(':no_entry_sign: **Error:** I couldn\'t send the ban embed in the #mod-log. Please make sure I have access to a channel called mod-log!'));
          m.edit(`**${member.user.username}**#${member.user.discriminator} has been banned. I've logged it in the #mod-log.`);
        } else {
          m.edit(`**${member.user.username}**#${member.user.discriminator} has been banned.`);
        }
      } else if (['n', 'no', 'cancel'].includes(co.first().content)) {
        return msg.say('Got it, I won\'t ban the user.');
      }
    }).catch(() => msg.say('Aborting ban, took longer than 30 seconds to reply.'));
  }
};
