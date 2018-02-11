const { Command } = require('discord.js-commando');

module.exports = class ResumeSongCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'resume',
      group: 'music',
      memberName: 'resume',
      description: 'Resumes the currently playing song.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  hasPermission(msg) {
    return this.client.isOwner(msg.author)
      || (msg.guild.roles.has(msg.guild.settings.get('dj')) ? this.hasDJRole(msg.author, msg) : true);
  }

  run(msg) {
    const queue = this.queue.get(msg.guild.id);
    if (!queue) return msg.reply('cannot resume a song when there\'s no song playing, silly!');
    if (!queue.songs[0].dispatcher) {
      return msg.reply('cannot resume a song when there\'s no song playing, silly!');
    }
    if (queue.songs[0].playing) return msg.reply('can\'t pause a song which isn\'t paused!'); // eslint-disable-line max-len
    queue.songs[0].dispatcher.resume();
    queue.songs[0].playing = true;

    return msg.reply('resumed the music.');
  }

  get queue() {
    if (!this._queue) this._queue = this.client.registry.resolveCommand('music:play').queue;

    return this._queue;
  }
  hasDJRole(user, msg) {
    user = this.client.users.resolve(user);
    if (!user) throw new TypeError('Invalid user');
    if (!msg.guild.roles.has(msg.guild.settings.get('dj'))) return false;
    return msg.member.roles.has(msg.guild.settings.get('dj'));
  }
};