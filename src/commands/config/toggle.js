const { Command } = require('discord.js-commando');

module.exports = class ToggleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'toggle',
      group: 'config',
      memberName: 'toggle',
      description: 'Toggles a certain feature.',
      details: 'Anybody with the Administrator permission can toggle a certain feature from the list below.\nnoinvite, nonsfw, modlog, djrole or joinlog.',
      examples: ['toggle joinlog', 'toggle noinvite'],
      guildOnly: true,
      args: [
        {
          key: 'feature',
          prompt: 'What feature would you like to toggle?\n',
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
    if (!msg.guild.me.permissions.has('MANAGE_CHANNELS')) return msg.reply(':no_entry_sign: [**Missing Permissions**]: I don\'t have the **Manage Channels** permission!');
    const feature = args.feature.toUpperCase();
    const db = this.client.database;
    const id = msg.guild.id;

    async function toggle(feature) {

      if (feature === 'NONSFW') {
        if (await db.checkSetting(id, 'nonsfw') === 'enabled') {
          await db.autoSet(id, 'nonsfw', 'disabled');
          msg.reply('<:red_check_mark:447576694845603840> The no NSFW feature is now **disabled**.');
        } else
        if (await db.checkSetting(id, 'nonsfw') === 'disabled') {
          await db.autoSet(id, 'nonsfw', 'enabled');
          msg.reply(':white_check_mark: The no NSFW feature is now **enabled**.');
        } else {
          await db.autoSet(id, 'nonsfw', 'enabled');
          msg.reply(':white_check_mark: The no NSFW feature is now **enabled**.');
        }
      } else

      if (feature === 'DJROLE') {
        if (!msg.guild.settings.get('dj')) return msg.reply(`:no_entry_sign: There is no DJ Role currently set.\nUse \`${msg.guild.commandPrefix}djrole [role]\` to set the DJ role.`);
        msg.guild.settings.remove('dj');
        return msg.reply('the DJ role has been **disabled**.');
      } else

      if (feature === 'NOINVITE' || feature === 'NOINV') {
        if (await db.checkSetting(id, 'noinvite') === 'enabled') {
          await db.autoSet(id, 'noinvite', 'disabled');
          msg.reply('<:red_check_mark:447576694845603840> The no invite feature is now **disabled**.');
        } else
        if (await db.checkSetting(id, 'noinvite') === 'disabled') {
          await db.autoSet(id, 'noinvite', 'enabled');
          msg.reply(':white_check_mark: The no invite feature is now **enabled**.');
        } else {
          await db.autoSet(id, 'noinvite', 'enabled');
          msg.reply(':white_check_mark: The no invite feature is now **enabled**.');
        }
      } else

      if (feature === 'MODLOG') {
        if (await db.checkSetting(id, 'modlog') === 'enabled') {
          await db.autoSet(id, 'modlog', 'disabled');
          const channel = msg.guild.channels.find('name', 'mod-log');
          channel.delete().catch(err => {
            msg.reply(':no_entry_sign: **Error:** I couldn\'t delete the #mod-log channel. Make sure I have access to it!');
          });
          msg.reply('<:red_check_mark:447576694845603840> The modlog is now **disabled**.');
        } else
        if (await db.checkSetting(id, 'modlog') === 'disabled') {
          await db.autoSet(id, 'modlog', 'enabled');
          msg.reply(':white_check_mark: The modlog is now **enabled**.');
          msg.guild.channels.create('mod-log', 'text')
            .then(modlog => {
              modlog.send('You have enabled the modlog. To disable this and delete this channel type, `toggle modlog`');
            });
        } else {
          await db.autoSet(id, 'modlog', 'enabled');
          msg.reply(':white_check_mark: The modlog is now **enabled**.');
          msg.guild.channels.create('mod-log', 'text')
            .then(modlog => {
              modlog.send('You have enabled the modlog. To disable this and delete this channel type, `toggle modlog`');
            });
        }
      } else

      if (feature === 'JOINLOG') {
        if (await db.checkSetting(id, 'joinlog') === 'enabled') {
          await db.autoSet(id, 'joinlog', 'disabled');
          const channel = msg.guild.channels.find('name', 'join-log');
          channel.delete().catch(err => {
            msg.reply(':no_entry_sign: **Error:** I couldn\'t delete the #join-log channel. Make sure I have access to it!');
          });
          msg.reply('<:red_check_mark:447576694845603840> The joinlog is now **disabled**.');
        } else
        if (await db.checkSetting(id, 'joinlog') === 'disabled') {
          await db.autoSet(id, 'joinlog', 'enabled');
          msg.reply(':white_check_mark: The joinlog is now **enabled**.');
          msg.guild.channels.create('join-log', 'text')
            .then(joinlog => {
              joinlog.send('You have enabled the joinlog. To disable this and delete this channel, type, `toggle joinlog`');
            });
        } else {
          await db.autoSet(id, 'joinlog', 'enabled');
          msg.reply(':white_check_mark: The joinlog is now **enabled**.');
          msg.guild.channels.create('join-log', 'text')
            .then(joinlog => {
              joinlog.send('You have enabled the joinlog. To disable this and delete this channel, type, `toggle joinlog`');
            });
        }
      } else {
        msg.reply(':no_entry_sign: That\'s not a valid feature. Avaliable features include:\nnoinvite, nonsfw, modlog and joinlog.');
      }
    }

    toggle(feature);
  }
};
