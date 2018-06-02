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
		try {
			const { body } = await this.client.snekfetch.get(`https://www.reddit.com/r/${subreddit}.json`)
				.query({ limit: 1000 })
      	.catch(err => {
					msg.say(`:no_entry_sign: Something went wrong while trying to search that subreddit.\n${err.message}`);
				});
			const allowed = msg.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
			if (!allowed.length) return msg.say(':no_entry_sign: This post contains NSFW content! If you would like to view it, you can run this command in a NSFW channel.');
			const embed = new this.client.embed();
			let data = this.client.randomArray(allowed).data;
			embed.setColor('#FF4500')
				.setAuthor(`Requested by ${msg.author.username}`, msg.author.avatarURL())
				.setTitle(data.title)
				.setURL(`https://reddit.com${data.permalink}`)
				.setImage(data.url)
		  	.setFooter(`${data.subreddit_name_prefixed} | 👍 ${data.ups}`)
	  	msg.embed(embed);
	  } catch(err) {
			msg.reply(':no_entry_sign: **Error:** Something went wrong while trying to search for that subreddit. The subreddit may not exist, or is invite-only.');
		}
	}
};
