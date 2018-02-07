const { Command } = require('discord.js-commando');

module.exports = class SetGameCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setgame',
      group: 'util',
      memberName: 'setgame',
      description: 'Sets the bot\'s game.',
      details: 'Only the bot owner can use this command.',
      args: [
        {
          key: 'game',
          prompt: 'What would you to set my game to?\n',
          type: 'string'
        }
      ]
    });
  }

  hasPermission(msg) {
    return this.client.options.owner === msg.author.id;
  }

  async run(msg, args) {
    const { game } = args;
    const m = await msg.say('*Setting my game...*');
    await this.client.shard.broadcastEval(`this.user.setPresence({ game: { name: \`${game}\`, type: 0 } })`);
    m.edit(`I'm now playing **${game}**.`);
  }
};
