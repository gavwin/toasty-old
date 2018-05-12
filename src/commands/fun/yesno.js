const { Command } = require('discord.js-commando');

module.exports = class YesNoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'yesno',
			aliases: ['yesorno'],
			group: 'fun',
			memberName: 'yesno',
			description: 'Answers with a gif saying yes or no.',
      args: [
        {
          key: 'question',
          prompt: 'What question are you asking?\n',
          type: 'string',
          default: ''
        }
      ]
		});
	}

	async run(msg, { question }) {
	  const { body } = await this.client.snekfetch.get('https://yesno.wtf/api')
      .catch(err => msg.say(`${err.name}: ${err.message}`));
  	const embed = new this.client.embed()
      .setAuthor(msg.author.username, msg.author.avatarURL())
      .setTitle(question)
			.setColor('RANDOM')
      .setImage(body.image)
    msg.embed(embed);
	}
};
