const { Command } = require('discord.js-commando');
const Canvas = require('canvas');
const fs = require('fs');
const path = require('path');

module.exports = class WantedCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'wanted',
      group: 'image',
      memberName: 'wanted',
      description: 'Puts a user on a wanted poster.',
      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 7
      }
    });
  }

  async run(msg) {
    if (!msg.guild.me.permissions.has('ATTACH_FILES')) return msg.channel.send(':no_entry_sign: [**Missing Permissions**]: I don\'t have the **Attach Files** permission!');

    const args = msg.content.split(' ').slice(1);

    if (!msg.channel.permissionsFor(this.client.user).has('ATTACH_FILES')) return msg.say(':no_entry_sign: [**Missing Permissions**]: I don\'t have the **Attach Files** permission!');
    let avatarurl = (msg.mentions.users.size > 0 ? msg.mentions.users.first().displayAvatarURL({ format: 'png' }) : msg.author.displayAvatarURL({ format: 'png' }));
    if (['jpg', 'jpeg', 'gif', 'png', 'webp'].some(x => args.join(' ').includes(x))) {
      avatarurl = args.join(' ').replace(/gif|webp/g, 'png');
    }
    try {
      const Image = Canvas.Image;
      const canvas = new Canvas(741, 1000);
      const ctx = canvas.getContext('2d');
      const base = new Image();
      const avatar = new Image();
      const generate = () => {
        ctx.drawImage(base, 0, 0);
        ctx.drawImage(avatar, 150, 360, 430, 430);
      };
      base.src = await fs.readFileAsync(path.join(__dirname, '..', '..', 'data', 'images', 'wanted.png'));
      const { body } = await this.client.snekfetch.get(avatarurl);
      avatar.src = body;
      generate();
      msg.channel.send({
        files: [{
          attachment: canvas.toBuffer(),
          name: 'wanted.png'
        }]
      });
    } catch (err) {
      return msg.say(`${err.name}: ${err.message}`);
    }
  }
};
