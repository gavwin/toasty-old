const { Command } = require('discord.js-commando');
const superagent = require('superagent');

module.exports = class SuggestCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'suggest',
      group: 'util',
      memberName: 'suggest',
      description: 'Allows you to suggest a feature for the bot.',
      examples: ['suggest make a meme command'],
      guildOnly: true,
      args: [
        {
          key: 'suggestion',
          prompt: 'What would you like to suggest?',
          type: 'string'
        }
      ],
      throttling: {
        usages: 1,
        duration: 15
      }
    });
  }

  run(msg, args) {
    function clean(text) {
        if (typeof(text) === "string")
            return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        else
            return text;
      }
    const { suggestion } = args;
    const content = clean(`**${msg.author.username}**#${msg.author.discriminator} (${msg.author.id}) suggested a feature:\n${suggestion}\nServer: **${msg.guild.name}**\nID: **${msg.guild.id}**`);
    const id = '303204291198451715';
    new Promise((resolve, reject) => {
      superagent.post(`https://discordapp.com/api/channels/${id}/messages`)
        .set('Authorization', `Bot ${this.client.token}`).send({ content })
        .end((err, res) => {
          if (err) {
            reject(err);
            msg.reply('There was an error while sending your suggestion to Toasty HQ. Please try again later.');
          } else {
            resolve(res);
            msg.say(`:white_check_mark: **${msg.author.username}**, your suggestion has successfully been submitted to Toasty HQ for review. Thank you!`);
          }
        });
    });
	}

};
