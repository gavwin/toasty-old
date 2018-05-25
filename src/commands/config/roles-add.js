const { Command } = require('discord.js-commando');

module.exports = class RolesAddCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'roles-add',
      group: 'config',
      memberName: 'roles-add',
      description: 'Adds a role to the server roles list avaliable to the `roleme` command.',
      details: 'Anybody with the Administrator permission can add or remove roles that can be gained with the `roleme` command.',
      examples: ['roles-add CSGO'],
      guildOnly: true,
      args: [
        {
          key: 'role',
          prompt: 'What role would you like to add to the roleme list?\n',
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
    if (data.hasOwnProperty('roles') && data.roles.includes(role)) return msg.reply(`:no_entry_sign: The role, **${role.name}** is already in the server roles list.`);
    await this.client.database.addRole(msg.guild.id, role.name);
    msg.reply(`:white_check_mark: Successfully added **${role.name}** to the server roles list.`);
  }
};
