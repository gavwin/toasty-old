const { Command } = require('discord.js-commando');

module.exports = class AddRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'addrole',
      aliases: ['setrole', 'giverole', 'give'],
      group: 'mod',
      memberName: 'addrole',
      description: 'Gives a user a role.',
      guildOnly: true,
      examples: ['addrole @user Members'],
      args: [
        {
          key: 'member',
          prompt: 'What user would you like to give a role to?\n',
          type: 'member'
        },
        {
          key: 'role',
          prompt: 'What role would you like to give the user?\n',
          type: 'role'
        }
      ]
    });
  }

  async run(msg, args) {
    const { member, role } = args;
    const { user } = member;
    if (!msg.member.permissions.has('MANAGE_ROLES') && msg.author.id !== msg.guild.ownerID) return msg.reply(':no_entry_sign: [**Invalid Permissions**]: You don\'t have the **Manage Roles** permission!');
    if (!msg.guild.me.permissions.has('MANAGE_ROLES')) return msg.reply(':no_entry_sign: [**Missing Permissions**]: I don\'t have the **Manage Roles** permission!');
    // const role = msg.guild.roles.filter(ro => ro.name.toLowerCase() === role.toLowerCase()).first();
    if (member.roles.has(role.id)) return msg.reply(':no_entry_sign: That user already has that role!');
    if (msg.guild.me.roles.highest.comparePositionTo(role) < 1) return msg.reply(':no_entry_sign: [**Missing Permissions**]: I don\'t have permissions to edit this role, please check the role order!');
    if (msg.member.roles.highest.comparePositionTo(role) < 1) return msg.reply(':no_entry_sign: [**Invalid Permissions**]: You don\'t have access to this role, please check role order!');
    const m = await msg.say('*Adding...*');
    await member.roles.add(role);
    return m.edit(`:white_check_mark: I have added the role of **${role.name}** to **${user.username}**.`);
  }
};
