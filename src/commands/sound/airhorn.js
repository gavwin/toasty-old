const { Command } = require('discord.js-commando');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', '..', 'data', 'audio', 'airhorn');
const horns = [
  `${dir}/1.mp3`,
  `${dir}/2.mp3`
];

module.exports = class AirhornCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'airhorn',
      group: 'sound',
      aliases: ['horn'],
      memberName: 'airhorn',
      description: 'BWWWAAAAAAAAAAAAAAAAAAAA!',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  async run(msg) {
    if (!msg.guild.me.permissions.has('CONNECT') || !msg.guild.me.permissions.has('SPEAK')) return msg.say(':no_entry_sign: I don\'t have the **Connect** or **Speak** permission.');
    const voiceChannel = msg.member.voiceChannel;
    if (!voiceChannel) return msg.reply(':no_entry_sign: Please be in a voice channel first!');
    if (!this.client.voiceConnections.get(msg.channel.guild.id)) {
      const connnection = await voiceChannel.join().catch(e => msg.say(`:no_entry_sign: Something wen't wrong!\n${e}`));
      const dispatcher = connnection.play(this.client.randomArray(horns));
      msg.react('📢');
      dispatcher.on('end', () => voiceChannel.leave());
    } else {
      msg.reply(`:no_entry_sign: It seems like I'm already playing something on this server.\n*If nothing's playing, type* \`${msg.guild.commandPrefix}leave\` *and try again.*`);
    }
  }
};
