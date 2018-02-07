const { Command } = require('discord.js-commando');

module.exports = class CleanCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'clean',
      group: 'util',
      memberName: 'clean',
      description: 'Cleans all recent commands/messages sent by the bot.',
      throttling: {
        usages: 1,
        duration: 10
      }
    });
  }

  async run(msg) {
    const m = await msg.say('*Cleaning my commands*...');
    if (!msg.guild.member(this.client.user).permissions.has('MANAGE_MESSAGES')) return m.edit(':no_entry_sign: Failed to clear commands because I\'m missing the **Manage Messages** permission.');
    const msgs = await msg.channel.fetchMessages({ limit: 90 });
    let msg_array = msgs.array().filter
    (m =>
      m.author.id === this.client.user.id ||
      m.content.startsWith(this.client.commandPrefix) ||
      m.content.toLowerCase().startsWith('cancel')
    );
    msg.channel.bulkDelete(msg_array);
    m.edit(':white_check_mark: Successfully cleaned up my commands!');
    setTimeout(() => { msg.delete() }, 1000);
  }
};
