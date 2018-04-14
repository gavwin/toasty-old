const { Command } = require('discord.js-commando');

module.exports = class ForceLeaveCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'leave',
      aliases: ['force-leave'],
      group: 'music',
      description: 'Force-leaves the voice channel when even the `stop` command doesn\'t work.',
      memberName: 'leave',
      throttling: {
        usages: 1,
        duration: 5
      },
      guildOnly: true
    });
  }
  run(msg) {
    const queue = this.queue.get(msg.guild.id);
    if (!msg.guild.me.voiceChannel) {
      return msg.reply('I am not connected to a voice channel, silly!');
    } else if (msg.guild.voiceConnection && msg.guild.voiceConnection.dispatcher && (queue && queue.songs && queue.songs[0] && queue.songs[0].dispatcher)) {
      return msg.reply('please try the `stop` command first before trying to force me to leave :(');
    } else {
      if (queue && queue.songs) queue.songs = [];
      if (queue && queue.songs[0]) queue.songs[0].dispatcher.end();
      if (msg.guild.voiceConnection && msg.guild.voiceConnection.dispatcher) msg.guild.voiceConnection.dispatcher.end();
      msg.guild.me.voiceChannel.leave();
      return msg.reply('successfully left your voice channel.');
    }
  }

  get queue() {
    return this.client.registry.resolveCommand('music:play').queue;
  }
};