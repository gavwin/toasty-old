const { Command } = require('discord.js-commando');
const superagent = require('superagent');

module.exports = class BugCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'bug',
      group: 'util',
      memberName: 'bug',
      description: 'Allows you to report a bug.',
      examples: ['bug the ping command doesn\'t work'],
      guildOnly: true,
      args: [
        {
          key: 'bug',
          prompt: 'What bug are you reporting?',
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
      if (typeof(text) === 'string')
        return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
      else
        return text;
    }
    const { bug } = args;
    const content = clean(`**${msg.author.username}**#${msg.author.discriminator} (${msg.author.id}) reported a bug:\n${bug}\nServer: **${msg.guild.name}**\nID: **${msg.guild.id}**`);
    const id = '434879965486645259';
    new Promise((resolve, reject) => {
      superagent.post(`https://discordapp.com/api/channels/${id}/messages`)
        .set('Authorization', `Bot ${this.client.token}`).send({ content })
        .end((err, res) => {
          if (err) {
            reject(err);
            msg.reply('There was an error while sending your bug report to Toasty HQ. Please try again later.');
          } else {
            resolve(res);
            msg.say(`:white_check_mark: **${msg.author.username}**, your bug report has successfully been submitted to Toasty HQ for review. Thank you!\nFor more information on it, join **https://toastybot.com/hq**.`);
          }
        });
    });
  }

};
