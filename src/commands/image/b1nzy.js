const { Command } = require('discord.js-commando');
const Canvas = require('canvas');
const path = require('path');

module.exports = class B1nzyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'b1nzy',
      group: 'image',
      memberName: 'b1nzy',
      description: 'Makes b1nzy talk.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'text',
          prompt: 'What do you want b1nzy to say?\n',
          type: 'string'
        }
      ]
    });
  }

  async run(msg, { text }) {
    if (!msg.guild.me.permissions.has('ATTACH_FILES')) return msg.channel.send(':no_entry_sign: [**Missing Permissions**]: I don\'t have the **Attach Files** permission!');

    const r = await this.client.snekfetch.get('https://i.imgur.com/kcjeRDa.png');
    const discord = new Canvas.Font('discord', path.join(__dirname, '..', '..', 'data', 'discord.ttf'));
    const canvas = new Canvas(489, 108);
    const ctx = canvas.getContext('2d');
    const base = new Canvas.Image();
    base.onload = () => {
      ctx.drawImage(base, 0, 0);
      ctx.addFont(discord)
      ctx.font = '16px discord';
      ctx.fillStyle = "#ffffff";
      ctx.fillText(text, 80, 55);
      msg.channel.send({
        files: [{
          attachment: canvas.toBuffer()
        }]
      });
    }
    base.src = r.body;
  }
};
