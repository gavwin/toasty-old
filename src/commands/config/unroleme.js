const { Command } = require('discord.js-commando');
const fs = require('fs');
const path = require('path');
const jsonPath = path.join(__dirname, '..', '..', 'data', 'servers.json');

module.exports = class UnRoleMeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'unroleme',
      group: 'config',
      memberName: 'unroleme',
      description: 'Allows any user to get or remove a role from the server roles list.',
      details: 'First you must set one or more server roles for this command to work.',
      examples: ['unroleme Team Orange'],
      guildOnly: true,
      args: [
        {
          key: 'role',
          prompt: 'What role would you like to be removed from?\n',
          type: 'string'
        }
      ],
      throttling: {
        usages: 1,
        duration: 10
      }
    });
  }

  async run(msg, { role }) {
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    if (!data.hasOwnProperty(msg.guild.id)) data[msg.guild.id] = {}, data[msg.guild.id].roles = [];
    if (!data[msg.guild.id].roles || data[msg.guild.id].roles === undefined || data[msg.guild.id].roles.size === 0) return msg.reply(`:no_entry_sign: That isn't an avaliable role to gain with this command. If you are a server Administrator please add a role to the server roles list with, \`${msg.guild.commandPrefix}roles-add [role name]\``);
    if (!data[msg.guild.id].roles.includes(role)) return msg.reply(`:no_entry_sign: The role, **${role}** isn't an avaliable role to gain with this command. You can check the avaliable roles with \`${msg.guild.commandPrefix}roles-list\`.`);
    if (!msg.guild.me.permissions.has('MANAGE_ROLES')) return msg.reply(':no_entry_sign: [**Missing Permissions**]: I don\'t have the **Manage Roles** permission!');
    if (msg.guild.me.roles.highest.comparePositionTo(role) < 1) return msg.reply(':no_entry_sign: [**Missing Permissions**]: I don\'t have permissions to edit this role, please check the role order!');
    const m = await msg.say('*Removing...*');
    const authorMember = await msg.guild.members.fetch(msg.author);
    await authorMember.roles.remove(msg.guild.roles.find('name', role).id);
    return m.edit(`:white_check_mark: I have removed you from **${role}**.`);
  }
};
