const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');

const Song = require('../../structures/Song');

module.exports = class MusicStatusCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'status',
      aliases: ['song', 'playing', 'current-song', 'now-playing'],
      group: 'music',
      memberName: 'status',
      description: 'Shows the current status of the music.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  run(msg) {
    const queue = this.queue.get(msg.guild.id);
    if (!queue) return msg.say('There is no music playing right now.');
    const song = queue.songs[0];
    const currentTime = song.dispatcher ? song.dispatcher.streamTime / 1000 : 0;

    return msg.say(stripIndents`
    ${`[${song}](${`${song.url}`})`}
    We are ${Song.timeString(currentTime)} into the song, and have ${song.timeLeft(currentTime)} left.
    ${!song.playing ? 'The music is paused.' : ''}
    `);
  }

  get queue() {
    if (!this._queue) this._queue = this.client.registry.resolveCommand('music:play').queue;

    return this._queue;
  }
};