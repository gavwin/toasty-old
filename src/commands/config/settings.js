const { Command } = require('discord.js-commando');

module.exports = class SettingsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'settings',
      group: 'config',
      aliases: ['serversettings', 'guildsettings'],
      memberName: 'settings',
      description: 'Shows all of the bot settings for your server.',
      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 5
      }
    });
  }

  run(msg) {
    const embed = new this.client.embed();
    this.client.database.getData(msg.guild.id).then(data => {
      embed.setColor('RANDOM')
        .setAuthor(`${msg.guild.name} Server Settings`, msg.guild.iconURL())
        .addField('Join Message', data.joinMessage || 'disabled')
        .addField('Leave Message', data.leaveMessage || 'disabled')
        .addField('Join DM', data.joinDM || 'disabled')
        .addField('Join Role', data.joinRole || 'disabled')
        .addField('Join Log', data.joinlog || 'disabled')
        .addField('Mod Log', data.modlog || 'disabled')
        .addField('No Invite', data.noinvite || 'disabled')
        .addField('No NSFW', data.nonsfw || 'disabled')
        .addField('DJ Role', data.DJRole || 'disabled')
      msg.embed(embed);
    }).catch(e => {
      embed.setColor('RANDOM')
        .setAuthor(`${msg.guild.name} Server Settings`, msg.guild.iconURL())
        .addField('Join Message', 'disabled')
        .addField('Leave Message', 'disabled')
        .addField('Join DM', 'disabled')
        .addField('Join Role', 'disabled')
        .addField('Join Log', 'disabled')
        .addField('Mod Log', 'disabled')
        .addField('No Invite', 'disabled')
        .addField('No NSFW', 'disabled')
        .addField('DJ Role', 'disabled')
      msg.embed(embed);
    });
  }
};
