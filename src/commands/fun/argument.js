const { Command } = require('discord.js-commando');
const path = require('path');
const fs = require('fs');

module.exports = class ArgumentCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'argument',
      group: 'fun',
      memberName: 'argument',
      description: 'Sends a topic that will start and argument.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  run(msg, args) {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'arguments.json')));
    msg.say(this.client.randomArray(data));
  }
};
