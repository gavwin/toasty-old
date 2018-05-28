const { Command } = require('discord.js-commando');
const Canvas = require('canvas');

module.exports = class RipCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'rip',
      group: 'image',
      description: 'Rest in peace.',
      memberName: 'rip',
      guildOnly: true,
      args: [
        {
          key: 'text',
          prompt: 'What text do you want on the image?\n',
          type: 'string',
          default: ''
        }
      ],
      throttling: {
        usages: 1,
        duration: 7
      }
    });
  }

  async run(msg, { text }) {
    if (!msg.guild.me.permissions.has('ATTACH_FILES')) return msg.channel.send(':no_entry_sign: [**Missing Permissions**]: I don\'t have the **Attach Files** permission!');

    const r = await this.client.snekfetch.get('http://cliparts.co/cliparts/pi7/8ok/pi78okjMT.png')
      .catch(err => msg.say(`${err.name}: ${err.message}`));
    const canvas = new Canvas(504, 594);
    const ctx = canvas.getContext('2d');
    const img_bg = new Canvas.Image();
    img_bg.onload = () => {
      ctx.drawImage(img_bg, 0, 0, 504, 594);
      ctx.font = 'bold 40px Arial';
      let args;
      if (msg.mentions.users.size > 0) args = msg.mentions.users.first().username;
      else if (text.length > 1) args = text;
      else args = msg.author.username;
      ctx.fillText(args, 237 - ctx.measureText(args).width / 2, 330);
      ctx.font = 'bold 30px Arial';
      ctx.fillText(`???? - ${(new Date()).getFullYear()}`, 160, 380);
      msg.channel.send({
        files: [{
          attachment: canvas.toBuffer(),
          name: 'rip.jpg'
        }]
      });
    }
    img_bg.src = r.body;
  }
};
