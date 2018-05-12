const { Command, util } = require('discord.js-commando');
const { disambiguation } = util;
const { stripIndents, oneLine } = require('common-tags');

module.exports = class HelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'help',
      group: 'util',
      memberName: 'help',
      aliases: ['commands', 'cmds'],
      description: 'Displays a list of available commands, or detailed information for a specified command.',
      details: oneLine`
				The command may be part of a command name or a whole command name.
				If it isn't specified, all available commands will be listed.
			`,
      examples: ['help', 'help prune'],
      guarded: true,
      args: [
        {
          key: 'command',
          prompt: 'Which command would you like to view the help for?',
          type: 'string',
          default: ''
        }
      ],
      throttling: {
        usages: 1,
        duration: 4
      }
    });
  }

  async run(msg, args) {
    const groups = this.client.registry.groups;
    const commands = this.client.registry.findCommands(args.command, false, msg);
    const showAll = args.command && args.command.toLowerCase() === 'all';
    if (args.command && !showAll) {
      if (commands.length === 1) {
        let help = stripIndents`
					${oneLine`
						__Command **${commands[0].name}**:__ ${commands[0].description}
						${commands[0].guildOnly ? ' (Usable only in servers)' : ''}
					`}

					**Format:** ${msg.anyUsage(`${commands[0].name}${commands[0].format ? ` ${commands[0].format}` : ''}`)}
				`;
        if (commands[0].aliases.length > 0) help += `\n**Aliases:** ${commands[0].aliases.join(', ')}`;
        help += `\n${oneLine`
					**Group:** ${commands[0].group.name}
				`}`;
        if (commands[0].details) help += `\n**Details:** ${commands[0].details}`;
        if (commands[0].examples) help += `\n**Examples:**\n${commands[0].examples.join('\n')}`;

        const messages = [];
        messages.push(await msg.say(help));
        return messages;
      } else if (commands.length > 1) {
        return msg.reply(disambiguation(commands, 'commands'));
      } else {
        return msg.reply(
          `Unable to identify command. Use ${msg.usage(
            null, msg.channel.type === 'dm' ? null : undefined, msg.channel.type === 'dm' ? null : undefined
          )} to view the list of all commands.`
        );
      }
    } else {
      const messages = [];
      try {
        messages.push(await msg.direct(stripIndents`
					${oneLine`
						To run a command in ${msg.guild || 'any server'},
						use ${Command.usage('command', msg.guild ? msg.guild.commandPrefix : null, this.client.user)}.
						For example, ${Command.usage('prefix', msg.guild ? msg.guild.commandPrefix : null, this.client.user)}.
					`}
					To run a command in this DM, simply use ${Command.usage('command', null, null)} with no prefix.

					Use ${this.usage('<command>', null, null)} to view detailed information about a specific command.
					Use ${this.usage('all', null, null)} to view a list of *all* commands, not just available ones.

					__**${showAll ? 'All commands' : `Available commands in ${msg.guild || 'this DM'}`}:**__

					${(showAll ? groups : groups.filter(grp => grp.commands.some(cmd => cmd.isUsable(msg))))
    .map(grp => stripIndents`
							__${grp.name}__
							${(showAll ? grp.commands : grp.commands.filter(cmd => cmd.isUsable(msg)))
    .map(cmd => `**${cmd.name}:** ${cmd.description}`).join('\n')
}
						`).join('\n\n')
}

          ${oneLine`
            For the official website go here: **http://toastybot.com**
            Please join the official Toasty server for further help or more! **https://toastybot.com/hq**
            There is an **expense to run this bot**, donations are **much** appreciated. Please donate here: **https://toastybot.com/donate**
            If you need help with anything, join Toasty HQ and ask for the dev.
          `}
				`, { split: true }));
        if (msg.channel.type !== 'dm') messages.push(await msg.say(`**${msg.author.username}**, :mailbox_with_mail: Check your DM's!`));
      } catch (err) {
        messages.push(await msg.reply('Unable to send you the help DM. You probably have DMs disabled.'));
      }
      return messages;
    }
  }
};
