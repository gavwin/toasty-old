const { Command } = require('discord.js-commando');

module.exports = class DJRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'djrole',
      description: 'Shows the DJ role, or sets the DJ role.',
      group: 'music',
      memberName: 'djrole',
      args: [
        {
          key: 'role',
          prompt: 'what role would you like to set the DJ Role to (to disable the DJ role, set it to disabled)?\n',
          type: 'role',
          default: ''
        }
      ]
    });
  }

  hasPermission(msg) {
    return msg.guild.ownerID === msg.author.id || msg.member.permissions.has('ADMINISTRATOR');
  }

  async run(msg, { role }) {
    if (!role) {
      const DJRole = msg.guild.roles.get(msg.guild.settings.get('dj'));
      if (!DJRole) return msg.reply('there is no DJ role set.');
      return msg.reply(`the current DJ role is ${DJRole.name}.`);
    } else {
      await msg.guild.settings.set('dj', role.id);
      return msg.reply(`successfully set the DJ role to ${role.name}`);
    }
  }
};
