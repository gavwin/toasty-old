const { Command } = require('discord.js-commando');
const tts = require('google-tts-api');
const path = require('path');
const { discordbotsToken } = require(path.join(__dirname, '..', '..', 'config.json'));
const snekfetch = require('snekfetch');

module.exports = class TTSCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'tts',
      group: 'fun',
      aliases: ['vsay', 'voicesay'],
      memberName: 'tts',
      description: 'Joins your voice channel and speaks the text you specified.',
      guildOnly: true,
      args: [
        {
          key: 'text',
          prompt: 'What would you like me to say in the voice channel?\n',
          type: 'string'
        }
      ],
      throttling: {
        usages: 1,
        duration: 10
      }
    });
  }

  async run(msg, args) {
    this.client.commands.tts++;
    if (!msg.guild.member(this.client.user).permissions.has('CONNECT') || !msg.guild.member(this.client.user).permissions.has('SPEAK')) return msg.say(':no_entry_sign: I don\'t have the **Connect** or **Speak** permission.');
    /*const { body } = await snekfetch
      .get(`https://discordbots.org/api/bots/208946659361554432/votes?onlyids=1`)
      .set('Authorization', discordbotsToken)
        if (!body.includes(msg.author.id)) return msg.reply(`:no_entry_sign: You can\'t use this command because you haven\'t upvoted me.\nType, \`${this.client.commandPrefix}upvote\` for the steps on how to upvote me.`);
        */const voiceChannel = msg.member.voiceChannel;
    if (!voiceChannel) return msg.reply(':no_entry_sign: Please be in a voice channel first!');
    if (!this.client.voiceConnections.get(msg.channel.guild.id)) {
      voiceChannel.join()
        .then(connnection => {
          tts(args.text, 'en', 1)
            .then((url) => {
              const dispatcher = connnection.playStream(url);
              msg.react('📢');
              dispatcher.on('end', () => voiceChannel.leave());
            })
            .catch((err) => {
              msg.say(':no_entry_sign: Something wen\'t wrong.\n' + err);
            });
        });
    } else {
      msg.say(':no_entry_sign: Sorry but it seems like I\'m already playing something on this server.');
    }
  }
};
