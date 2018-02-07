const { Command } = require('discord.js-commando');
const cows = require('cows');
const rn = require('random-number');

module.exports = class CowCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'cow',
      group: 'fun',
      memberName: 'cow',
      description: 'Sends a random ASCII cow.',
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  run(msg) {
    const options = {
        min: 0,
        max: cows().length - 1,
        integer: true
    };
    const random = rn(options);
    msg.channel.send(cows()[random], { code: ''});
  }
};
