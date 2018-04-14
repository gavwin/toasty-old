const { Command } = require('discord.js-commando');

module.exports = class HQCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'hq',
      group: 'misc',
      aliases: ['support', 'toastyhq'],
      memberName: 'hq',
      description: 'Sends the invite to my support server / HQ.',
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }
  run(msg) {
    msg.say(`:mailbox_with_mail: **${msg.author.username}**, check your DM's!`);
    msg.author.send('**Join Toasty HQ with these invites!**\nhttps://discord.gg/sKCDdfp\nhttps://toastybot.com/hq');
  }
};
