const { Command } = require('discord.js-commando');

module.exports = class ShowerthoughtCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'showerthought',
			aliases: ['showerthoughts'],
			group: 'fun',
			memberName: 'showerthought',
			description: 'Thoughts in the shower.'
		});
	}

	async run(msg) {
		const { body } = await this.client.snekfetch.get('https://www.reddit.com/r/Showerthoughts.json')
			.query({ limit: 1000 });
		const allowed = msg.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
		if (!allowed.length) return msg.say('Hmm... It seems the thoughts are all gone right now. Try again later!');
		msg.say(`🤔 ${this.client.randomArray(allowed).data.title}`);
	}
};
