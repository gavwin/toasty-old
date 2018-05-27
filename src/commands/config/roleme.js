const { Command } = require('discord.js-commando');

module.exports = class RoleMeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'roleme',
      group: 'config',
      memberName: 'roleme',
      description: 'Allows any user to get or remove a role from the server roles list.',
      details: 'First you must set one or more server roles for this command to work.',
      examples: ['roleme Team Orange'],
      guildOnly: true,
      args: [
        {
          key: 'role',
          prompt: 'What role would you like to be added to?\n',
          type: 'role'
        }
      ],
      throttling: {
        usages: 1,
        duration: 10
      }
    });
  }

  async run(msg, { role }) {
    const data = await this.client.database.getData(msg.guild.id);
    const roles = data.roles;
    if (!msg.guild.me.permissions.has('MANAGE_ROLES')) return msg.reply(':no_entry_sign: [**Missing Permissions**]: I don\'t have the **Manage Roles** permission!');
    if (roles == null || roles.size === 0) return msg.reply(`:no_entry_sign: That isn't an avaliable role to gain with this command. If you are a server Administrator please add a role to the server roles list with, \`${msg.guild.commandPrefix}roles-add [role name]\``);
    if (!roles.includes(role.name)) return msg.reply(`:no_entry_sign: The role, **${role.name}** isn't an avaliable role to gain with this command. You can check the avaliable roles with \`${msg.guild.commandPrefix}roles-list\`.`);
    if (msg.guild.me.roles.highest.comparePositionTo(role) < 1) return msg.reply(':no_entry_sign: [**Missing Permissions**]: I don\'t have permissions to edit this role, please check the role order!');
    const authorMember = await msg.guild.members.fetch(msg.author);
    await authorMember.roles.add(role);
    return msg.say(`:white_check_mark: I have added you to **${role.name}**.`);
  }
};
