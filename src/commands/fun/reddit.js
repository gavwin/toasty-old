const { Command } = require('discord.js-commando');

module.exports = class RedditCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'reddit',
			group: 'fun',
			memberName: 'reddit',
			description: 'Displays a random post from the specified sub-reddit.',
      examples: ['reddit bestof', 'reddit gaming', 'reddit 4chan'],
      args: [
        {
          key: 'subreddit',
          prompt: 'What subreddit would you like to fetch a post from?\n',
          type: 'string'
        }
      ],
      throttling: {
        usages: 1,
        duration: 3
      }
		});
	}

	async run(msg, { subreddit }) {
		const { body } = await this.client.snekfetch.get(`https://www.reddit.com/r/${subreddit}.json`)
			.query({ limit: 1000 })
      .catch(err => {
				msg.say(`:no_entry_sign: Something went wrong while trying to search that subreddit.\n${err.message}`);
			});
		const allowed = msg.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
		if (!allowed.length) return msg.say(':no_entry_sign: It seems all the posts on this subreddit are gone, or it wasn\'t found!');
		const embed = new this.client.embed();
		let data = allowed[Math.floor(Math.random() * allowed.length)].data;
		embed.setColor('RANDOM')
			.setAuthor(`Requested by ${msg.author.username}`, msg.author.avatarURL())
			.setTitle(data.title)
			.setURL(`https://reddit.com${data.permalink}`)
			.setImage(data.url)
			.setFooter(`${data.subreddit_name_prefixed} | 👍 ${data.ups}`)
		msg.embed(embed);
	}
};
