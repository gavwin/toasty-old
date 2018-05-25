const { Command } = require('discord.js-commando');

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

  async run(msg) {
    let data = await this.client.database.getData(msg.guild.id).catch(e => {
      return msg.reply(`:no_entry_sign: There are currently no \`roleme\` roles on this server. If you are a server Administrator please add a role to the server roles list with, \`${msg.guild.commandPrefix}roles-add [role name]\``);
    });
    let roles = data.roles;
    if (!roles || roles == null || roles.length === 0) return msg.reply(`:no_entry_sign: There are currently no \`roleme\` roles on this server. If you are a server Administrator please add a role to the server roles list with, \`${msg.guild.commandPrefix}roles-add [role name]\``);
    msg.say(`Avaliable roleme roles for **${msg.guild.name}**:\n${roles.join('\n')}`);
  }
};
