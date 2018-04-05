const { Command } = require('discord.js-commando');
const fs = require('fs');
const path = require('path');
const jsonPath = path.join(__dirname, '..', '..', 'data', 'servers.json');

module.exports = class RolesListCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'roles-list',
      group: 'config',
      aliases: ['rolelist', 'roles'],
      memberName: 'roles-list',
      description: 'Lists the avaliable `roleme` roles.',
      details: 'Anybody with the Administrator permission can add or remove roles that can be gained with the `roleme` command.',
      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 10
      }
    });
  }

  run(msg, args) {
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const { role } = args;
    if (!data[msg.guild.id]) data[msg.guild.id] = { roles: [] };
    if (!data[msg.guild.id].roles || data[msg.guild.id].roles === undefined || data[msg.guild.id].roles.size === 0) return msg.reply(`:no_entry_sign: There are currently no \`roleme\` roles on this server. If you are a server Administrator please add a role to the server roles list with, \`${this.client.commandPrefix}roles-add [role name]\``);
    msg.channel.send(`Avaliable roleme roles for **${msg.guild.name}**:\n${data[msg.guild.id].roles.join('\n')}`);
  }
};
