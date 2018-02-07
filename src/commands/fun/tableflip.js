const { Command } = require('discord.js-commando');

module.exports = class TableFlipCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'tableflip',
      group: 'fun',
      aliases: ['tf', 'flip'],
      memberName: 'tableflip',
      description: 'Flips a table in the chat.',
      throttling: {
        usages: 1,
        duration: 10
      }
    });
  }

  async run(msg) {
    const m = await msg.say('┬─┬ノ( º _ ºノ)');
    setTimeout(() => { m.edit('(°-°)\\ ┬─┬') }, 450);
    setTimeout(() => { m.edit('(╯°□°)╯    ]') }, 950);
    setTimeout(() => { m.edit('(╯°□°)╯  ︵  ┻━┻') }, 1250);
  }
};
