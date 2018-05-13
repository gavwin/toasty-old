const { Command } = require('discord.js-commando');

module.exports = class StopMusicCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'stop',
      aliases: ['kill', 'stfu'],
      group: 'music',
      memberName: 'stop',
      description: 'Stops the music and clears the queue.',
      details: 'The "Manage Messages" permission is required.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  hasPermission(msg) {
    return this.client.isOwner(msg.author)
      || (msg.guild.roles.has(msg.guild.settings.get('dj')) ? this.hasDJRole(msg.author, msg) : msg.member.hasPermission('MANAGE_MESSAGES'));
  }

  run(msg) {
    const queue = this.queue.get(msg.guild.id);
    if (!queue) return msg.reply(`there isn't any music playing right now.\n*If I'm playing music through any of the Sound Commands, use* \`${msg.guild.commandPrefix}leave\``);
    const song = queue.songs[0];
    queue.songs = [];
    if (song && song.dispatcher) song.dispatcher.end();

    return msg.reply('I\'ve successfully stopped playback and cleared the queue.');
  }

  get queue() {
    return this.client.registry.resolveCommand('music:play').queue;
  }

  hasDJRole(user, msg) {
    user = this.client.users.resolve(user);
    if (!user) throw new TypeError('Invalid user');
    if (!msg.guild.roles.has(msg.guild.settings.get('dj'))) return false;
    return msg.member.roles.has(msg.guild.settings.get('dj'));
  }
};
