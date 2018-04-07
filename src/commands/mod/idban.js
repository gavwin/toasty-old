const { Command } = require('discord.js-commando');

module.exports = class IDBanCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'idban',
      group: 'mod',
      aliases: ['banid'],
      memberName: 'idban',
      description: 'Ban a user by their ID from the server.',
      examples: ['ban 208946659361554432'],
      guildOnly: true,
      args: [
        {
          key: 'user',
          prompt: 'What user would you like to ban?\n',
          type: 'string'
        }
      ]
    });
  }

  async run(msg, args) {
    const { user } = args;
    if (user === this.client.user.id) return msg.reply('I can\'t ban myself \\:P');
    if (!msg.member.permissions.has('BAN_MEMBERS') && msg.author.id !== msg.guild.ownerID) return msg.reply(':no_entry_sign: [**Invalid Permissions**]: You don\'t have the **Ban Members** permission!');
    if (!msg.guild.me.permissions.has('BAN_MEMBERS')) return msg.reply(':no_entry_sign: [**Missing Permissions**]: I don\'t have the **Ban Members** permission!');
    const m = await msg.say('*Banning user...*');
    const ban = await msg.guild.members.ban(user).catch(e => m.edit(':no_entry_sign: That\'s not a valid user ID.'));
    m.edit(`:white_check_mark: I've banned the user ID of ${user}`);
  }
};
