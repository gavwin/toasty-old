const { Command } = require('discord.js-commando');

module.exports = class UsagesCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'usages',
      group: 'util',
      memberName: 'usages',
      description: 'Shows how many times the commands have been used.',
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

    client.registry.commands.array().forEach(async (command) => {
      let usages = await getUsages(command.name, client);
      if (usages < 1) return;
      console.log(`${command.name}: ${usages}`);
    });
  }
};
