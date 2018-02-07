const { Command } = require('discord.js-commando');

module.exports = class ToastCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'toast',
      group: 'misc',
      memberName: 'toast',
      description: 'Sends a picture of toast.',
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  run(msg) {
    msg.say('... is my creator! Here\'s a pic\nhttp://images.amcnetworks.com/bbcamerica.com/wp-content/uploads/2013/06/Toast.jpg');
  }
};
