const { Command } = require('discord.js-commando');

module.exports = class UpvoteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'upvote',
      group: 'pokemon',
      memberName: 'upvote',
      description: 'Gives the steps on how to upvote me.',
      details: 'This is required for access to the Pokemon commands.',
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  run(msg) {
    const steps =
      `**__How to upvote me:__**
      1. **Go to http://toastybot.com/upvote** (You will be redirected).
      2. **__Login__ to your Discord account on the top right corner of the website.**
      3. **Click the "Upvote" button that looks like the image below.**
      4. **You should now be able to use the Pokemon commands!**
      If the Pokemon commands still do not work for you, type, \`${this.client.commandPrefix}hq\` and ask for support.
      http://i.imgur.com/ussvWiV.png
      `;

      msg.say(steps);
  }
};
