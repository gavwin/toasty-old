const { Command } = require('discord.js-commando');
const fs = require('fs');
const path = require('path');

module.exports = class SettingsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'settings',
      group: 'config',
      aliases: ['serversettings', 'guildsettings'],
      memberName: 'settings',
      description: 'Shows all of the bot settings for your server.',
      throttling: {
        usages: 1,
        duration: 5
      }
    });
  }

  async run(msg) {
    const m = await msg.say('*Fetching your server settings...*');
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'servers.json')));
    const embed = new this.client.embed();
    const settingsData = data[msg.guild.id] ? data[msg.guild.id] : {settings: 'none'};

    if (!settingsData.noinvite) {
      var noinvite = 'disabled';
    } else {
      var noinvite = settingsData.noinvite;
    }
    if (!settingsData.joinMessage) {
      var joinMessage = 'disabled';
    } else {
      var joinMessage = settingsData.joinMessage;
    }
    if (!settingsData.leaveMessage) {
      var leaveMessage = 'disabled';
    } else {
      var leaveMessage = settingsData.leaveMessage;
    }
    if (!settingsData.joinDM) {
      var joinDM = 'disabled';
    } else {
      var joinDM = settingsData.joinDM;
    }
    if (!settingsData.joinRole) {
      var joinRole = 'disabled';
    } else {
      var joinRole = settingsData.joinRole;
    }
    if (!settingsData.joinlog) {
      var joinlog = 'disabled';
    } else {
      var joinlog = settingsData.joinlog;
    }
    if (!settingsData.nonsfw) {
      var nonsfw = 'disabled';
    } else {
      var nonsfw = settingsData.nonsfw;
    }
    if (!settingsData.modlog) {
      var modlog = 'disabled';
    } else {
      var modlog = settingsData.modlog;
    }
    if (!settingsData.DJRole) {
      var DJRole = 'disabled';
    } else {
      var DJRole = settingsData.DJRole;
    }

    embed.setColor('RANDOM')
      .setAuthor(`Server settings for, ${msg.guild.name}`, msg.guild.iconURL)
      .setDescription('')
      .addField('Join Message', joinMessage, true)
      .addField('Leave Message', leaveMessage, true)
      .addField('Join DM', joinDM, true)
      .addField('Join Role', joinRole, true)
      .addField('Join Log', joinlog, true)
      .addField('Mod Log', modlog, true)
      .addField('No Invite', noinvite, true)
      .addField('No NSFW', nonsfw, true)
      .addField('DJ Role', DJRole, true);
    m.edit({ embed });
  }
};
