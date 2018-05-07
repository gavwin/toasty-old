const { Command } = require('discord.js-commando');
const { caseNumber } = require('../../util/caseNumber.js');

module.exports = class KickCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'kick',
      group: 'mod',
      memberName: 'kick',
      description: 'Kicks a user from the server.',
      examples: ['kick @user', 'kick @user spamming in chat'],
      guildOnly: true,
      args: [
        {
          key: 'member',
          prompt: 'What user would you like to kick?\n',
          type: 'member'
        },
        {
          key: 'reason',
          prompt: 'What is the reason you kicked this user?\n',
          type: 'string',
          default: ''
        }
      ]
    });
  }

  async run(msg, args) {
    const data = await this.client.database.getData(msg.guild.id);
    const { member, reason } = args;
    if (member.user.id === this.client.user.id) return msg.reply(':no_entry_sign: I can\'t kick myself \\:P');
    if (!msg.member.permissions.has('KICK_MEMBERS') && msg.author.id !== msg.guild.ownerID) return msg.reply(':no_entry_sign: [**Invalid Permissions**]: You don\'t have the **Kick Members** permission!');
    if (!msg.guild.me.permissions.has('KICK_MEMBERS')) return msg.reply(':no_entry_sign: [**Missing Permissions**]: I don\'t have the **Kick Members** permission!');
    if (!member.kickable) return msg.reply(':no_entry_sign: **Error:** I could not kick this user. Make sure that my highest role is above the user you are trying to kick.');
    const m = await msg.say('*Kicking user...*');
    await member.kick();
    if (data.modlog === 'disabled' || !msg.guild.channels.find('name', 'mod-log')) {
      m.edit(`**${member.user.username}**#${member.user.discriminator} has been kicked.`);
    } else
    if (data.modlog === 'enabled') {
      const embed = new this.client.embed();
      const channel = msg.guild.channels.find('name', 'mod-log');
      const caseNum = await caseNumber(this.client, channel);
      embed.setColor(0xFFA500)
        .setTimestamp(new Date())
        .setAuthor(member.user.username, member.user.displayAvatarURL())
        .setDescription(`**Action:** Kick\n**Target:** ${member.user.username}#${member.user.discriminator} (${member.user.id})\n**Responsible Moderator:** ${msg.author.username}#${msg.author.discriminator} (${msg.author.id})\n**Reason:** ${reason}`)
        .setFooter(`Case ${caseNum}`);
      channel.send({ embed }).catch(err => {
        return msg.reply(':no_entry_sign: **Error:** I couldn\'t send the kick embed in the #mod-log. Please make sure I have access to a channel called mod-log!');
      });
      m.edit(`**${member.user.username}**#${member.user.discriminator} has been kicked. I've logged it in the #mod-log.`);
    } else {
      m.edit(`**${member.user.username}**#${member.user.discriminator} has been kicked.`);
    }
  }
};
