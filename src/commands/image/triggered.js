const { Command } = require('discord.js-commando');
const path = require('path');
const Jimp = require('jimp');
const GIFEncoder = require('gifencoder');

const options = {
    size: 256,
    frames: 8
}

module.exports = class TriggeredCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'triggered',
      group: 'image',
      memberName: 'triggered',
      guildOnly: true,
      description: 'Takes a user\'s avatar and makes it into a triggered gif.',
      throttling: {
        usages: 1,
        duration: 10
      }
    });
  }

    async run(msg) {
      function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      if (!msg.guild.me.permissions.has('ATTACH_FILES')) return msg.channel.send(':no_entry_sign: [**Missing Permissions**]: I don\'t have the **Attach Files** permission!');

      const args = msg.content.split(' ').slice(1);

      let avatarurl = (msg.mentions.users.size > 0 ? msg.mentions.users.first().displayAvatarURL({ format: 'png' }) : msg.author.displayAvatarURL({ format: 'png' }));
      if (['jpg', 'jpeg', 'gif', 'png', 'webp'].some(x => args.join(' ').includes(x))) {
        avatarurl = args.join(' ').replace(/gif|webp/g, 'png');
      }

      const base = new Jimp(options.size, options.size);
      const avatar = await Jimp.read(avatarurl);
      const text = await Jimp.read(path.join(__dirname, '..', '..', 'data', 'images', 'triggered.jpg'));
      const tint = await Jimp.read(path.join(__dirname, '..', '..', 'data', 'images', 'red.png'));

      avatar.resize(320, 320);
      tint.scaleToFit(base.bitmap.width, base.bitmap.height);
      tint.opacity(0.2);
      text.scaleToFit(280, 60);

      const frames = [];
      const buffers = [];
      const encoder = new GIFEncoder(options.size, options.size);
      const stream = encoder.createReadStream();
      let temp;

      stream.on('data', async buffer => await buffers.push(buffer));
      stream.on('end', async() => {
        return await msg.channel.send({
          files: [{
            name: 'triggered.gif',
            attachment: Buffer.concat(buffers)
          }]
        });
      });

      for (let i = 0; i < options.frames; i++) {
        temp = base.clone();

        if (i === 0) {
          temp.composite(avatar, -16, -16);
        } else {
          temp.composite(avatar, -32 + getRandomInt(-16, 16), -32 + getRandomInt(-16, 16));
        }

        temp.composite(tint, 0, 0);

        if (i === 0) temp.composite(text, -10, 200);
        else temp.composite(text, -12 + getRandomInt(-8, 8), 200 + getRandomInt(-0, 12));

        frames.push(temp.bitmap.data);
        }

      encoder.start();
      encoder.setRepeat(0);
      encoder.setDelay(20);
      for (const frame of frames) {
        encoder.addFrame(frame);
      }
      encoder.finish();

    }
};
