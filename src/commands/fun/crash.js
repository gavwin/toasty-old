const { Command } = require('discord.js-commando');

module.exports = class CrashCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'crash',
      group: 'fun',
      memberName: 'crash',
      description: 'Sends the Windows crash screen.',
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  run(msg) {
    msg.say(':x: Uh oh!\nhttp://www.howtogeek.com/wp-content/uploads/2013/05/windows-8-blue-screen-error.png');
  }
};
