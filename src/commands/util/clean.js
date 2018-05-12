const { Command } = require('discord.js-commando');

module.exports = class CleanCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'clean',
      group: 'util',
      memberName: 'clean',
      description: 'Cleans all recent commands/messages sent by the bot.',
      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 10
      }
    });
  }

  async run(msg) {
    const m = await msg.say('*Cleaning my commands*...');
    if (!msg.guild.me.permissions.has('MANAGE_MESSAGES')) {
      return m.edit(':no_entry_sign: Failed to clear commands because I\'m missing the **Manage Messages** permission.');
    }
    const msgs = await msg.channel.messages.fetch({ limit: 90 });
    const msgArray = msgs.filter(mes =>
      mes.author.id === this.client.user.id
      || mes.content.startsWith(this.client.commandPrefix)
      || mes.content.toLowerCase().startsWith('cancel')
    );
    msg.channel.bulkDelete(msgArray);
    m.edit(':white_check_mark: Successfully cleaned up my commands!');
    setTimeout(() => { msg.delete() }, 1000);
    return null;
  }
};
