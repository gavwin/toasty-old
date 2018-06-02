const { Command } = require('discord.js-commando');
const { exec } = require('child_process');

module.exports = class ExecuteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'exec',
      aliases: ['execute'],
      group: 'util',
      memberName: 'exec',
      description: 'Executes command in the shell.',
      details: 'Only the bot owner can use this.',
      args: [
        {
          key: 'code',
          prompt: 'What would you like to execute?\n',
          type: 'string'
        }
      ]
    });
  }

  async run(msg, args) {
    if (!this.client.isOwner(msg.author)) return msg.reply(':no_entry_sign: [**Invalid Permissions**]: Only the bot creator can use this command!');
    exec(args.code, (err, stdout, stderr) => {
      if (err) return msg.channel.send(err.message, { code: '' });
      return msg.channel.send(stdout, { code: '' });
    });
  }
};
