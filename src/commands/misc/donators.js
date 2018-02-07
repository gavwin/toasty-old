const { Command } = require('discord.js-commando');
const path = require('path');

module.exports = class DonatorsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'donators',
      group: 'misc',
      memberName: 'donators',
      description: 'Lists my donators.',
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  run(msg) {
    const donators = require(path.join(__dirname, '..', '..', 'data', 'donators.json'));
    msg.say('These are the kind people that have kept Toasty alive!\n  **' + donators.join('\n** **') + '**');
  }
}
