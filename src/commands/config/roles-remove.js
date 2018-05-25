const { Command } = require('discord.js-commando');

module.exports = class RolesRemoveCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'roles-remove',
      group: 'config',
      memberName: 'roles-remove',
      description: 'Removes a role to the server roles list avaliable to the `roleme` command.',
      details: 'Anybody with the Administrator permission can add or remove roles that can be gained with the `roleme` command.',
      examples: ['roles-remove CSGO'],
      guildOnly: true,
      args: [
        {
          key: 'role',
          prompt: 'What role would you like to remove from the roleme list?\n',
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
    if (!msg.member.permissions.has('ADMINISTRATOR') && msg.author.id !== msg.guild.ownerID) return msg.reply(':no_entry_sign: [**Invalid Permissions**]: You don\'t have the **Administrator** permission!');
    const data = await this.client.database.getData(msg.guild.id);
    if (!data.hasOwnProperty('roles')) return msg.reply(`:no_entry_sign: There are currently no \`roleme\` roles on this server. If you are a server Administrator please add a role to the server roles list with, \`${msg.guild.commandPrefix}roles-add [role name]\``);
    if (data.hasOwnProperty('roles') && !data.roles.includes(role.name)) return msg.reply(`:no_entry_sign: The role, **${role.name}** is not in the server roles list.`);
    await this.client.database.removeRole(msg.guild.id, role.name);
    msg.reply(`:white_check_mark: Successfully removed **${role.name}** from the server roles list.`);
  }
};
