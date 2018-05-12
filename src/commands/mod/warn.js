const { Command } = require('discord.js-commando');
const { caseNumber } = require('../../util/caseNumber.js');

module.exports = class WarnCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'warn',
      group: 'mod',
      memberName: 'warn',
      description: 'Warns a user.',
      examples: ['warn @user spamming in chat'],
      guildOnly: true,
      args: [
        {
          key: 'member',
          prompt: 'What user would you like to warn?\n',
          type: 'member'
        },
        {
          key: 'reason',
          prompt: 'What is the reason you are warning this user?\n',
          type: 'string'
        }
      ]
    });
  }

  async run(msg, args) {
    const { member, reason } = args;
    if (member.user.id === this.client.user.id) return msg.reply('I can\'t warn myself \\:P');
    if (!msg.member.permissions.has('KICK_MEMBERS') && msg.author.id !== msg.guild.ownerID) return msg.reply(':no_entry_sign: [**Invalid Permissions**]: You don\'t have the **Kick Members** command.\n*This command requires Kick Members permission.*');

    const data = await this.client.database.getData(msg.guild.id);
    if (data.modlog === 'disabled' || !msg.guild.channels.find('name', 'mod-log')) {
      msg.reply(`:no_entry_sign: The modlog must be enabled for me to issue warnings. Type, \`${msg.guild.commandPrefix}toggle modlog\` to enable it.`);
    } else
    if (data.modlog === 'enabled') {
      const embed = new this.client.embed();
      const channel = msg.guild.channels.find('name', 'mod-log');
      const caseNum = await caseNumber(this.client, channel);
      embed.setColor(0xFFFF00)
        .setTimestamp(new Date())
        .setAuthor(member.user.username, member.user.displayAvatarURL())
        .setDescription(`**Action:** Warn\n**Target:** ${member.user.username}#${member.user.discriminator} (${member.user.id})\n**Responsible Moderator:** ${msg.author.username}#${msg.author.discriminator} (${msg.author.id})\n**Reason:** ${reason}`)
        .setFooter(`Case ${caseNum}`);
      channel.send({ embed }).catch(err => {
        return msg.reply(':warning: **Error:** I couldn\'t send the warning embed in the #mod-log. Please make sure I have access to a channel called mod-log!');
      });
      msg.delete();
      msg.say(`<@${member.user.id}>, :no_entry_sign: This is a warning!\n${reason}`);
    } else {
      msg.reply(`:no_entry_sign: The modlog must be enabled for me to issue warnings. Type, \`${msg.guild.commandPrefix}toggle modlog\` to enable it.`);
    }
  }

};
