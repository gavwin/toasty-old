const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');
const moment = require('moment-timezone');

module.exports = class UserInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'userinfo',
      aliases: ['user', 'user-info'],
      group: 'info',
      memberName: 'userinfo',
      description: 'Get detailed info on a user.',
      guildOnly: true,
      args: [
        {
          key: 'member',
          prompt: 'What user would you like to have information on?\n',
          type: 'member',
          default: ''
        }
      ],
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  async run(msg, args) {
    if (!msg.channel.permissionsFor(this.client.user).has('EMBED_LINKS')) return msg.reply(':no_entry_sign: I don\'t have the **Embed Links** permission!');

    const statuses = {
      online: '212789758110334977',
      idle: '212789859071426561',
      dnd: '236744731088912384',
      offline: '212790005943369728'
    };

    const user = args.member.user || msg.author;
    const member = args.member || msg.member;

    const embed = new this.client.embed();
    embed.setAuthor(`${user.username}#${user.discriminator} (${user.id})`, user.avatarURL());
    embed.setThumbnail(user.displayAvatarURL());
    embed.setFooter(this.client.user.username, this.client.user.avatarURL());
    embed.setTimestamp(new Date());
    embed.addField('**User Information**', stripIndents`
		Account Creation: ${moment(user.createdAt).tz('America/Chicago').format('dddd, MMMM Do YYYY, h:mm:ss a zz')}
		Status: ${user.presence.status}
		Game: ${user.presence.game ? user.presence.game.name : 'N/A'}
		`);
    embed.setColor('RANDOM');
    embed.addField('**Member Information**', stripIndents`
	  Joined Server At: ${moment(member.joinedAt).tz('America/Chicago').format('dddd, MMMM Do YYYY, h:mm:ss a zz')}
		Nickname: ${member.nickname ? member.nickname : 'N/A'}
		`);
    if (member.roles.size > 1) {
      if (member.roles.size <= 10) {
        embed.addField('Roles', member.roles.map(role => {
          if (role.name !== '@everyone') return role.name;
          return '';
        }).join(', ').substring(2), true);
      } else {
        embed.addField('Roles', 'Too many to display', true);
      }
    }
    return msg.embed(embed);
  }
};
