const { Command } = require('discord.js-commando');

module.exports = class WhitelistCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'whitelist',
			group: 'util',
			memberName: 'whitelist',
			description: 'Remove a user from the blacklist.',
			args: [
				{
					key: 'userID',
					prompt: 'What user do you wish to whitelist?\n',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		if (msg.author.id !== this.client.options.owner && msg.author.id !== '220568440161697792') return msg.reply(':no_entry_sign: [**Invalid Permissions**]: Only the bot owner can use this command!');
		const user = args.userID;
		const blacklist = this.client.provider.get('global', 'userBlacklist', []);
		if (!blacklist.includes(user)) return msg.reply(':no_entry_sign: That user is not blacklisted.');
		const index = blacklist.indexOf(user);
		blacklist.splice(index, 1);
		if (blacklist.length === 0) this.client.provider.remove('global', 'userBlacklist');
		else this.client.provider.set('global', 'userBlacklist', blacklist);
		return msg.reply(`User ID: \`${user}\` has been removed from the blacklist.`);
	}
};
