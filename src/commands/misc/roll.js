const { Command } = require('discord.js-commando');

module.exports = class RollCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'roll',
      group: 'misc',
      memberName: 'roll',
      description: 'Rolls the given numbers.',
      args: [
        {
          key: 'num1',
          prompt: 'What is the first number you\'d like to roll?',
          type: 'integer'
        },
        {
          key: 'num2',
          prompt: 'What is the second number you\'d like to roll?',
          type: 'integer'
        }
      ],
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  run(msg, { num1, num2 }) {
    msg.say(`**${msg.author.username}** :game_die: , you rolled a **${(Math.floor(Math.random() * num2) + num1).toLocaleString()}**.`);
  }
};
