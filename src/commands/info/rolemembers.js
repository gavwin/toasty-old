const { Command } = require('discord.js-commando');

module.exports = class RoleMembersCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'rolemembers',
      group: 'info',
      aliases: ['roleusers'],
      memberName: 'rolemembers',
      description: 'Shows all the users who have a particular role on the server.',
      guildOnly: true,
      args: [
        {
          key: '_role',
          prompt: 'Members of what role would you like to display?\n',
          type: 'role'
        }
      ],
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  run(msg, { _role }) {
    const arr = new Array(), o = new Object();
    msg.guild.members.forEach(member => {
      if (member.roles.size > 1) {
        if (member.roles.find(role => role.name === _role.name)) {
          arr.push(`\`${member.user.tag}\``);
        }
      } else {
        return;
      }
    });

    if (arr.join(' ').length > 1900) return msg.say(`Users with the role, **${_role.name}**:\nToo many users to display.`);
    msg.say(`Users with the role, **__${_role.name}__** (**${arr.length}** results)\n\n${arr.join(', ')}`);
  }
};
