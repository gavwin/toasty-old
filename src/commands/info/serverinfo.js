const { Command } = require('discord.js-commando');
const moment = require('moment-timezone');

module.exports = class ServerInfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'serverinfo',
			aliases: ['server-info', 'server', 'guild', 'guildinfo'],
			group: 'info',
			memberName: 'serverinfo',
			description: 'Get detailed info on the server.',
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 3
			}
		});
	}

	async run(msg) {
		if (!msg.channel.permissionsFor(this.client.user).hasPermission('EMBED_LINKS')) return msg.reply(':no_entry_sign: I don\'t have the **Embed Links** permission!');

		const guild = await msg.guild.fetchMembers();
		const bots = `${guild.members.filter(member => member.user.bot).size} bots`;
		const onlinePeeps = `${guild.members.size} members\n${guild.members.filter(member => member.presence.status !== 'offline').size} online`;

		const embed = new this.client.embed();
		embed.setColor('RANDOM')
			   .setAuthor(`${msg.guild.name} (${msg.guild.id})`, msg.guild.iconURL)
			   .addField('Created at', moment(msg.guild.createdAt).tz('America/Chicago').format('dddd, MMMM Do YYYY, h:mm:ss a zz'), true)
			   .addField('Owner', `${msg.guild.owner.user.username}#${msg.guild.owner.user.discriminator} (${msg.guild.owner.id})`)
			   .addField('Channels', msg.guild.channels.size, true)
			   .addField('Members', `${onlinePeeps} ${bots}`, true);
		if (msg.guild.roles.size >= 10) embed.addField('Roles', msg.guild.roles.size, true);
		else embed.addField('Roles', msg.guild.roles.map(role => role).join(' '), true);
		return msg.channel.sendEmbed(embed).catch(() => null);
	}
};
