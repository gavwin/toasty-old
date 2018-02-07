const { Command } = require('discord.js-commando');
const Canvas = require('canvas');
const snekfetch = require('snekfetch');
const fs = require('fs');
const path = require('path');

module.exports = class TriggeredCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'triggered',
      group: 'fun',
      memberName: 'triggered',
      description: 'Put a user\'s avatar on a "Triggered" sign.',
      guildOnly: true,
      args: [
        {
          key: 'user',
          prompt: 'Which user would you like to make triggered?\n',
          type: 'user',
          default: ''
        }
      ],
      throttling: {
        usages: 1,
        duration: 15
      }
    });
  }

  async run(msg, args) {
    if (!msg.channel.permissionsFor(this.client.user).has('ATTACH_FILES')) return msg.say(':no_entry_sign: [**Missing Permissions**]: I don\'t have the **Attach Files** permission!');
    const user = args.user || msg.author;
    const avatarURL = user.avatarURL;
    if (!avatarURL) return msg.say(':no_entry_sign: That user has no avatar.');
    try {
      const Image = Canvas.Image;
      const canvas = new Canvas(320, 371);
      const ctx = canvas.getContext('2d');
      const base = new Image();
      const avatar = new Image();
      const generate = () => {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 320, 371);
        ctx.drawImage(avatar, 0, 0, 320, 320);
        const imgData = ctx.getImageData(0, 0, 320, 320);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.max(255, data[i]);
        }
        ctx.putImageData(imgData, 0, 0);
        ctx.drawImage(base, 0, 0);
      };
      base.src = await fs.readFileAsync(path.join(__dirname, '..', '..', 'data', 'images', 'triggered.png'));
      const { body } = await snekfetch.get(avatarURL);
      avatar.src = body;
      generate();
      const buffer = canvas.toBuffer();
      const toSend = fs.writeFileSync('file.png', buffer);
      return msg.say('', {file: 'file.png'}).catch(err => msg.say(`${err.name}: ${err.message}`));
    } catch (err) {
      return msg.say(`${err.name}: ${err.message}`);
    }
  }
};
