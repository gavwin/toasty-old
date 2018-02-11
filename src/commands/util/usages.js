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
    msg.say(
      `Pokemon: **${await getUsages('pokemon', client)}**.
TTS: **${await getUsages('tts', client)}**.
Play: **${await getUsages('play', client)}**.
Roast: **${await getUsages('roast', client)}**.
Roast me: **${await getUsages('roastme', client)}**.
Meme: **${await getUsages('meme', client)}**.`
    );
  }

};
