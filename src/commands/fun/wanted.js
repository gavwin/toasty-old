const { Command } = require('discord.js-commando');
const Canvas = require('canvas');
const snekfetch = require('snekfetch');
const fs = require('fs');
const path = require('path');

module.exports = class WantedCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'wanted',
      group: 'fun',
      memberName: 'wanted',
      description: 'Puts a user on a wanted poster.',
      guildOnly: true,
      args: [
        {
          key: 'user',
          prompt: 'Which user would you like to make wanted?\n',
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
      const canvas = new Canvas(741, 1000);
      const ctx = canvas.getContext('2d');
      const base = new Image();
      const avatar = new Image();
      const generate = () => {
        ctx.drawImage(base, 0, 0);
        ctx.drawImage(avatar, 150, 360, 430, 430);
      };
      base.src = await fs.readFileAsync(path.join(__dirname, '..', '..', 'data', 'images', 'wanted.png'));
      const { body } = await snekfetch.get(avatarURL);
      avatar.src = body;
      generate();
      const buffer = canvas.toBuffer();
      const toSend = fs.writeFileSync('file.png', buffer);
      return msg.say('', { file: 'file.png' }).catch(err => msg.say(`${err.name}: ${err.message}`));
    } catch (err) {
      return msg.say(`${err.name}: ${err.message}`);
    }
  }
};
