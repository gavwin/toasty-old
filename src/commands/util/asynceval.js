const { Command } = require('discord.js-commando');

module.exports = class AsyncEvalCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'asynceval',
      aliases: ['aeval', 'async'],
      group: 'util',
      memberName: 'asynceval',
      description: 'Asynchronously evaluate JavaScript code.',
      details: 'Only the bot owner can use this command.',
      args: [
        {
          key: 'code',
          prompt: 'What would you like me to asynchronously evaluate?\n',
          type: 'string'
        }
      ]
    });
  }

  hasPermission(msg) {
    return this.client.options.owner === msg.author.id;
  }

  async run(msg, { code }) {
    try {
      let evaled = eval(
        (async()=>{ code })()
      );
      msg.say('**Result:**\`\`\`js\n ' + evaled + '\n\`\`\`');
    } catch (err) {
      msg.say(":warning: **ERROR** :warning: \`\`\`\n" + err + "\n\`\`\`");
    }
  }
};
