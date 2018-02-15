const { Command } = require('discord.js-commando');
const fs = require('fs');
const path = require('path');
const jsonPath = path.join(__dirname, '..', '..', 'data/servers.json');

module.exports = class ToggleCommand extends Command {
<<<<<<< HEAD
  constructor(client) {
    super(client, {
      name: 'toggle',
      group: 'config',
      memberName: 'toggle',
      description: 'Toggles a certain feature.',
      details: 'Anybody with the Administrator permission can toggle a certain feature from the list below.\nnoinvite, nonsfw, nomemedog, modlog, djrole or joinlog.',
      examples: ['toggle joinlog', 'toggle noinvite'],
      guildOnly: true,
      args: [
        {
          key: 'feature',
          prompt: 'What feature would you like to toggle?\n',
          type: 'string'
        }
      ],
=======
	constructor(client) {
		super(client, {
			name: 'toggle',
			group: 'config',
			memberName: 'toggle',
			description: 'Toggles a certain feature.',
      details: 'Anybody with the Administrator permission can toggle a certain feature from the list below.\nnoinvite, nonsfw, nomemedog, modlog, djrole or joinlog.',
			examples: ['toggle joinlog', 'toggle noinvite'],
			guildOnly: true,
			args: [
				{
					key: 'feature',
					prompt: 'What feature would you like to toggle?\n',
					type: 'string'
				}
			],
>>>>>>> upstream/master
      throttling: {
        usages: 1,
        duration: 10
      }
    });
  }

  run(msg, args) {
    if (!msg.member.permissions.has('ADMINISTRATOR') && msg.author.id !== msg.guild.ownerID) return msg.reply(':no_entry_sign: [**Invalid Permissions**]: You don\'t have the **Administrator** permission!');
    const data = JSON.parse(fs.readFileSync(jsonPath), 'utf8');
    const feature = args.feature.toUpperCase();

    function toggle(feature) {

      if (feature === 'NONSFW') {
        if (!data[msg.guild.id]) data[msg.guild.id] = {'nonsfw': 'disabled'};
        if (data[msg.guild.id].nonsfw === 'enabled') {
          data[msg.guild.id].nonsfw = 'disabled';
          fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
          msg.reply(':white_check_mark: The no NSFW feature is now **disabled**.');
        } else
        if (!data[msg.guild.id].nonsfw === 'disabled') {
          data[msg.guild.id].nonsfw = 'enabled';
          fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
          msg.reply(':white_check_mark: The no NSFW feature is now **enabled**.');
        } else {
          data[msg.guild.id].nonsfw = 'enabled';
          fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
          msg.reply(':white_check_mark: The no NSFW feature is now **enabled**.');
        }
      } else

      if (feature === 'DJROLE') {
<<<<<<< HEAD
        if (!msg.guild.settings.has('dj')) return msg.reply('there is no DJ Role set.');
=======
        if (!msg.guild.settings.has('dj')) return msg.reply(`there is no DJ Role set.`);
>>>>>>> upstream/master
        msg.guild.settings.delete('dj');
        return msg.reply('the DJ role has been disabled.');
      } else

      if (feature === 'NOINVITE' || feature === 'NOINV') {
        if (!data[msg.guild.id]) data[msg.guild.id] = {'noinvite': 'disabled'};
        if (data[msg.guild.id].noinvite === 'enabled') {
          data[msg.guild.id].noinvite = 'disabled';
          fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
          msg.reply(':white_check_mark: The no invite feature is now **disabled**.');
        } else
        if (!data[msg.guild.id].noinvite === 'disabled') {
          data[msg.guild.id].noinvite = 'enabled';
          fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
          msg.reply(':white_check_mark: The no invite feature is now **enabled**.');
        } else {
          data[msg.guild.id].noinvite = 'enabled';
          fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
          msg.reply(':white_check_mark: The no invite feature is now **enabled**.');
        }
      } else

      if (feature === 'NOMEMEDOG') {
        if (!data[msg.guild.id]) data[msg.guild.id] = {'nomemedog': 'disabled'};
        if (data[msg.guild.id].nomemedog === 'enabled') {
          data[msg.guild.id].nomemedog = 'disabled';
          fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
          msg.reply(':white_check_mark: The no memedog feature is now **disabled**.');
        } else
        if (!data[msg.guild.id].nomemedog === 'disabled') {
          data[msg.guild.id].nomemedog = 'enabled';
          fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
          msg.reply(':white_check_mark: The no memedog feature is now **enabled**.');
        } else {
          data[msg.guild.id].nomemedog = 'enabled';
          fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
          msg.reply(':white_check_mark: The no memedog feature is now **enabled**.');
        }
      } else

      if (feature === 'MODLOG') {
        if (!data[msg.guild.id]) data[msg.guild.id] = {'modlog': 'disabled'};
        if (data[msg.guild.id].modlog === 'enabled') {
          data[msg.guild.id].modlog = 'disabled';
          fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
          const channel = msg.guild.channels.find('name', 'mod-log');
          channel.delete().catch(err => {
            msg.reply(':no_entry_sign: **Error:** I couldn\'t delete the #mod-log channel. Make sure I have access to it!');
          });
          msg.reply(':white_check_mark: The modlog is now **disabled**.');
        } else
        if (data[msg.guild.id].modlog === 'disabled') {
          data[msg.guild.id].modlog = 'enabled';
          fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
          msg.reply(':white_check_mark: The modlog is now **enabled**.');
          msg.guild.createChannel('mod-log', 'text')
            .then(modlog => {
              modlog.send('You have enabled the modlog. To disable this and delete this channel type, `toggle modlog`');
            });
        } else {
          data[msg.guild.id].modlog = 'enabled';
          fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
          msg.reply(':white_check_mark: The modlog is now **enabled**.');
          msg.guild.createChannel('mod-log', 'text')
            .then(modlog => {
              modlog.send('You have enabled the modlog. To disable this and delete this channel type, `toggle modlog`');
            });
        }
      } else

      if (feature === 'JOINLOG') {
        if (!data[msg.guild.id]) data[msg.guild.id] = {'joinlog': 'disabled'};
        if (data[msg.guild.id].joinlog === 'enabled') {
          data[msg.guild.id].joinlog = 'disabled';
          fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
          const channel = msg.guild.channels.find('name', 'join-log');
          channel.delete().catch(err => {
            msg.reply(':no_entry_sign: **Error:** I couldn\'t delete the #join-log channel. Make sure I have access to it!');
          });
          msg.reply(':white_check_mark: The joinlog is now **disabled**.');
        } else
        if (!data[msg.guild.id].joinlog === 'disabled') {
          data[msg.guild.id].joinlog = 'enabled';
          fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
          msg.reply(':white_check_mark: The joinlog is now **enabled**.');
          msg.guild.createChannel('join-log', 'text')
            .then(joinlog => {
              joinlog.send('You have enabled the joinlog. To disable this and delete this channel, type, `toggle joinlog`');
            });
        } else {
          data[msg.guild.id].joinlog = 'enabled';
          fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
          msg.reply(':white_check_mark: The joinlog is now **enabled**.');
          msg.guild.createChannel('join-log', 'text')
            .then(joinlog => {
              joinlog.send('You have enabled the joinlog. To disable this and delete this channel, type, `toggle joinlog`');
            });
        }
      } else {
        msg.reply(':no_entry_sign: That\'s not a valid feature. Avaliable features include:\nnoinvite, nonsfw, nomemedog, modlog and joinlog.');
      }
    }

    toggle(feature);
  }
};
