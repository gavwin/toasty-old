const { Command } = require('discord.js-commando');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', '..', 'data', 'audio', 'mememusic');

module.exports = class MemeSongCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'memesong',
      group: 'sound',
      aliases: ['mememusic'],
      memberName: 'memesong',
      description: 'Plays a random memey song.',
      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 5
      }
    });
  }

  async run(msg) {
    if (!msg.guild.me.permissions.has('CONNECT') || !msg.guild.me.permissions.has('SPEAK')) return msg.say(':no_entry_sign: I don\'t have the **Connect** or **Speak** permission.');
    const files = fs.readdirSync(dir);
    const voiceChannel = msg.member.voiceChannel;
    if (!voiceChannel) return msg.reply(':no_entry_sign: Please be in a voice channel first!');
    if (!this.client.voiceConnections.get(msg.channel.guild.id)) {
      const connnection = await voiceChannel.join().catch(e => msg.say(`:no_entry_sign: Something wen't wrong!\n${e}`));
      const dispatcher = connnection.play(`${dir}/${this.client.randomArray(files)}`);
      msg.react('😂');
      dispatcher.on('end', () => voiceChannel.leave());
    } else {
      msg.reply(`:no_entry_sign: It seems like I'm already playing something on this server.\n*If nothing's playing, type* \`${msg.guild.commandPrefix}leave\` *and try again.*`);
    }
  }
};
