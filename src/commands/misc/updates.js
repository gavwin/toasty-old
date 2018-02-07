const { Command } = require('discord.js-commando');

module.exports = class UpdatesCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'updates',
      group: 'misc',
      memberName: 'updates',
      description: 'Gives you the Updates role on Toasty HQ.',
      details: 'Can only be used on Toasty HQ.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  async run(msg) {
    if (msg.guild.id !== '208674478773895168') return;
    const role = msg.guild.roles.find('name', 'Updates');
    if (msg.member.roles.has(role.id)) {
        msg.member.removeRole(role).catch(e => { msg.reply(e) });
        msg.reply(':no_entry_sign: You will no longer recieve updates about Toasty on this server.');
    } else if (!msg.member.roles.has(role.id)) {
        msg.member.addRole(role).catch(e => { msg.reply(e) });
        msg.reply(':white_check_mark: You will now recieve updates about Toasty on this server.');
    }
  }
}
