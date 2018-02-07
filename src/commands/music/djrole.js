const { Command } = require('discord.js-commando');
const fs = require('fs');
const path = require('path');
const jsonPath = path.join(__dirname, '..', '..', 'data/servers.json');

module.exports = class DJRoleCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'djrole',
			group: 'music',
			memberName: 'djrole',
			description: 'Sets the server DJ role.',
      details: 'The DJ role allows a user to use `skip`, `clearqueue`,',
			examples: ['djrole', 'djrole off'],
			guildOnly: true,
			args: [
				{
					key: 'role',
					prompt: 'What role would you like to set the DJ role to?\n',
					type: 'string'
				}
			],
      throttling: {
        usages: 1,
        duration: 15
      }
		});
	}

  hasPermission(msg) {
    return msg.member.hasPermission('ADMINISTRATOR') || msg.author.id === msg.guild.ownerID;
  }

  run(msg, args) {
		const data = JSON.parse(fs.readFileSync(jsonPath), 'utf8');
    const { role } = args;

    if (!data[msg.guild.id]) data[msg.guild.id] = {'DJRole': 'disabled'};

    if (role.toLowerCase() === 'off') {
      data[msg.guild.id].DJRole = 'disabled';
      fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
      msg.reply(':white_check_mark: The DJ role is now **disabled**.');
    } else {
      data[msg.guild.id].DJRole = role;
      fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
      msg.reply(`:white_check_mark: The DJ role is now **${role}**`);
    }

  }
};
