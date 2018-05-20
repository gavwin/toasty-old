const { Command } = require('discord.js-commando');

module.exports = class SetCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'set',
      group: 'config',
      memberName: 'set',
      description: 'Sets a certain feature.',
      details: 'Anybody with the Administrator permission can set certain features from the list below.\njoinmessage, joindm, joinrole and leavemessage.',
      examples: ['set joinrole Members', 'set joinmessage Welcome {user} to my server!', 'set joinmessage disabled'],
      guildOnly: true,
      args: [
        {
          key: 'feature',
          prompt: 'What feature would you like to set?\n',
          type: 'string'
        },
        {
          key: 'to',
          prompt: 'What would you like to set it to?\n',
          type: 'string'
        }
      ],
      throttling: {
        usages: 1,
        duration: 10
      }
    });
  }

  async run(msg, args) {
    if (!msg.member.permissions.has('ADMINISTRATOR') && msg.author.id !== msg.guild.ownerID) return msg.reply(':no_entry_sign: [**Invalid Permissions**]: You don\'t have the **Administrator** permission!');
    const feature = args.feature.toUpperCase();
    const to = args.to;
    const db = this.client.database;
    const id = msg.guild.id;

    async function set(feature) {

      if (feature === 'JOINMESSAGE') {
        if (to === 'disabled') {
          await db.autoSet(id, 'joinMessage', 'disabled');
          msg.reply('<:red_check_mark:447576694845603840> The join message is now **disabled**.');
        } else {
          await db.autoSet(id, 'joinMessage', to);
          msg.reply(`:white_check_mark: The join message is now set to:\n${to}`);
        }
      } else

      if (feature === 'LEAVEMESSAGE') {
        if (to === 'disabled') {
          await db.autoSet(id, 'leaveMessage', 'disabled');
          msg.reply('<:red_check_mark:447576694845603840> The leave message is now **disabled**.');
        } else {
          await db.autoSet(id, 'leaveMessage', to);
          msg.reply(`:white_check_mark: The leave message is now set to:\n${to}`);
        }
      } else

      if (feature === 'JOINDM') {
        if (to === 'disabled') {
          await db.autoSet(id, 'joinDM', 'disabled');
          msg.reply('<:red_check_mark:447576694845603840> The join DM is now **disabled**.');
        } else {
          await db.autoSet(id, 'joinDM', to);
          msg.reply(`:white_check_mark: The join DM is now set to:\n${to}`);
        }
      } else

      if (feature === 'JOINROLE') {
        if (to === 'disabled') {
          await db.autoSet(id, 'joinRole', 'disabled');
          msg.reply('<:red_check_mark:447576694845603840> The join role is now **disabled**.');
        } else {
          await db.autoSet(id, 'joinRole', to);
          msg.reply(`:white_check_mark: The join role is now set to **${to}**`);
        }
      } else {
        msg.reply(':no_entry_sign: That\'s not a valid feature. Avaliable features include:\njoinmessage, joindm, joinrole and leavemessage.');
      }
    }

    set(feature);
  }
};
