const { Command } = require('discord.js-commando');

module.exports = class UsagesCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'usages',
      group: 'util',
      memberName: 'usages',
      description: 'Shows how many times the top commands have been used.',
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  async run(msg) {
    const client = this.client;

    async function getUsages(command, client) {
      const usages = await client.shard.fetchClientValues(`commands.${command}`);
      return usages.reduce((prev, val) => prev + val, 0).toLocaleString();
    }

    let arr = [];
    client.registry.commands.array().forEach(async (command) => {
      arr.push(`${command.name}: ${await getUsages(command.name, client)}`);
    });
    console.log(arr);

    msg.say(arr.join('\n'));
  }
};
