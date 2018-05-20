const { Command } = require('discord.js-commando');

module.exports = class RestartCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'restart',
      group: 'util',
      aliases: ['reboot'],
      memberName: 'restart',
      description: 'Restarts the bot.',
      details: 'Only the bot owner can use this command.',
      args: [
        {
          key: 'restartType',
          prompt: 'Would you like to restart just this shard. or all shards?\n',
          type: 'string'
        }
      ]
    });
  }

  async run(msg, args) {
    if (msg.author.id !== this.client.options.owner && !this.client.staff.includes(msg.author.id)) return msg.reply(':no_entry_sign: [**Invalid Permissions**]: Only the bot owner can use this command!');
    const restartType = args.restartType.toLowerCase();
    if (restartType === 'this') {
      msg.say(`\`\`\`css\nRestarting shard ${this.client.shard.id + 1}...\`\`\``);
      console.log(`Restarting shard ${this.client.shard.id + 1}...`);
      setTimeout(() => { console.log(process.exit(0)); }, 400);
    } else
    if (restartType === 'all') {
      msg.say('```css\nRestarting all shards...```');
      console.log('Restarting all shards...');
      setTimeout(() => {
        this.client.shard.broadcastEval('console.log(process.exit(0))').then(x => {
          console.log(x);
        });
      }, 400);
    } else {
      msg.say(`\`\`\`css\nRestarting shard ${restartType}...\`\`\``);
      console.log(`Restarting shard ${restartType}...`);
      setTimeout(() => {
        this.client.shard.broadcastEval('if (shard.id === %s) return console.log(process.exit(0))', restartType - 1).then(x => {
          console.log(x);
        });
      }, 400);
    }
  }
};
