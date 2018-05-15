const { Command } = require('discord.js-commando');
const tts = require('google-tts-api');

module.exports = class TTSCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'tts',
      group: 'sound',
      aliases: ['vsay', 'voicesay'],
      memberName: 'tts',
      description: 'Joins your voice channel and speaks the text you specified.',
      guildOnly: true,
      args: [
        {
          key: 'text',
          prompt: 'What would you like me to say in the voice channel?\n',
          type: 'string',
          max: 200
        }
      ],
      throttling: {
        usages: 1,
        duration: 10
      }
    });
  }

  async run(msg, { text }) {
    if (!msg.guild.me.permissions.has('CONNECT') || !msg.guild.me.permissions.has('SPEAK')) return msg.say(':no_entry_sign: I don\'t have the **Connect** or **Speak** permission.');
    const voiceChannel = msg.member.voiceChannel;
    if (!voiceChannel) return msg.reply(':no_entry_sign: Please be in a voice channel first!');
    if (!this.client.voiceConnections.get(msg.channel.guild.id)) {
      const connection = await voiceChannel.join().catch(e => msg.say(`:no_entry_sign: Something wen't wrong!\n${e}`));
      const url = await tts(text, 'en', 1);
      const dispatcher = connection.play(url);
      msg.react('📢');
      dispatcher.on('end', () => voiceChannel.leave());
    } else {
      msg.say(':no_entry_sign: Sorry but it seems like I\'m already playing something on this server.');
    }
  }
};
