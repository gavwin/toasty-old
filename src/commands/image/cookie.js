const { Command } = require('discord.js-commando');

const cookies = ['http://i.imgur.com/SLwEY66.gif', 'http://i.imgur.com/K6VoNp3.gif', 'http://i.imgur.com/knVM6Lb.gif',
    'http://i.imgur.com/P1BMly5.gif', 'http://i.imgur.com/I8CrTUT.gif', 'https://i.imgur.com/0XTueQR.png',
    'https://i.imgur.com/u9k8x4J.png', 'https://i.imgur.com/AUtfHnK.png', 'https://i.imgur.com/XjTbrKc.png',
    'https://i.imgur.com/A3mgqEh.png', 'https://i.imgur.com/YnkdGZd.png', 'https://i.imgur.com/FJsOnOE.png',
    'https://i.imgur.com/RQFPwDg.png', 'https://i.imgur.com/vyCTGr0.png', 'https://i.imgur.com/kkXToc8.png',
    'https://i.imgur.com/ctHwqVL.png', 'https://i.imgur.com/yUaCPvC.png', 'https://i.imgur.com/IUM6Z8F.png'
];

module.exports = class CookieCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'cookie',
      group: 'image',
      description: 'Give a user a cookie!',
      memberName: 'cookie',
      guildOnly: true,
      args: [
        {
          key: 'user',
          prompt: 'Who would you like to give a cookie to?\n',
          type: 'user'
        }
      ],
      throttling: {
        usages: 1,
        duration: 7
      }
    });
  }

  async run(msg, { user }) {
    if (!msg.guild.me.permissions.has('ATTACH_FILES')) return msg.reply(':no_entry_sign: [**Missing Permissions**]: I don\'t have the **Attach Files** permission!');
    msg.channel.send(`**🍪 | <@${msg.author.id}> has given <@${user.id}> a cookie!**`, {
      files: [{
        attachment: this.client.randomArray(cookies)
      }]
    });
  }
};
