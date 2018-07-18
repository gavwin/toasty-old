const { Command, util } = require('discord.js-commando');
const { stripIndents, oneLine } = require('common-tags');

module.exports = class DuplicatesCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'duplicates',
      group: 'pokemon',
      aliases: ['dupes'],
      memberName: 'duplicates',
      description: 'Shows all of the duplicate pokemon you have in your inventory.',
      guildOnly: true,
      args: [
        {
          key: 'user',
          prompt: 'Who\'s pokemon duplicates would you like to view?\n',
          type: 'user',
          default: ''
        }
      ],
      throttling: {
        usages: 1,
        duration: 10
      }
    });
  }

  async run(msg, args) {
    if (!msg.guild.me.permissions.has('ADD_REACTIONS')) return msg.reply(':no_entry_sign: [**Missing Permissions**]: I don\'t have the **Add Reactions** permission!');
    const user = args.user || msg.author;
    let inventory = await this.client.pokemon.getInventory(user.id);
    if (!inventory.length) {
      msg.reply(`${args.user ? 'that user doesn\'t' : 'you don\'t'} have any Pokemon!`);
      return;
    }

    let toSend = new Array();
    const r = this.client.r.db('Pokemon').table('Pokemon');
    const res = await r.get(user.id).run();
    let data = res[user.id].pokemon;
    Object.keys(data).forEach(key => {
      if (data[key].count < 2) return;
      toSend.push(`**${data[key].name}** x${data[key].count}`);
    });
    const paginatedItems = util.paginate(toSend, 1, 25);

    let current = 1;
    const max = Math.ceil(toSend.length / 25);

    /* eslint-disable max-len */
    const mesg = await msg.say(stripIndents`
      __**${user.username}'s Duplicates:**__ [Page 1 (25 shown)]
      ${paginatedItems.items.join('\n')}
    `);

    if (msg.guild && msg.guild.me.hasPermission('ADD_REACTIONS')) {
      await Promise.all([
        await mesg.react('⬅'),
        await mesg.react('➡'),
        await mesg.react('❌')
      ]).catch(() => msg.say(oneLine`
        I am unable to add the reactions required to naviage through the pages.
        You can either add the reactions (⬅ and ➡) manually, or give me the \`Add Reactions\`
        permission, which will allow me to react on the message.
      `));
    } else if (!msg.guild) {
      await Promise.all([
        await mesg.react('⬅'),
        await mesg.react('➡'),
        await mesg.react('❌')
      ]).catch(() => msg.say(oneLine`
        I am unable to add the reactions required to naviage through the pages.
        You can either add the reactions (⬅ and ➡) manually, or give me the \`Add Reactions\`
        permission, which will allow me to react on the message.
      `));
    } else {
      msg.say(oneLine`
        I am unable to add the reactions required to naviage through the pages.
        You can either add the reactions (⬅ and ➡) manually, or give me the \`Add Reactions\`
        permission, which will allow me to react on the message.
      `);
    }

    const filter = (reaction, _user) => (reaction.emoji.name === '⬅' || reaction.emoji.name === '➡' || reaction.emoji.name === '❌') && _user.id === msg.author.id;

    const collector = mesg.createReactionCollector(filter, { time: 180e3 });
    collector.on('collect', async reaction => {
      if (reaction.emoji.name === '⬅') {
        if (current === 1) {
          await msg.reply('you cannot go back to a page if you\'re already on the first page.');
        } else {
          current -= 1;
          await mesg.edit(stripIndents`
            __**${user.username}'s Duplicates:**__ [Page ${current} (25 shown)]
            ${util.paginate(toSend, current, 25).items.join('\n')}
          `);
        }
      } else if (reaction.emoji.name === '➡') {
        if (current >= max) {
          await msg.reply('you cannot go to the next page if you\'re already on the last page.');
        } else {
          current += 1;
          await mesg.edit(stripIndents`
            __**${user.username}'s Duplicates:**__ [Page ${current} (25 shown)]
            ${util.paginate(toSend, current, 25).items.join('\n')}
          `);
        }
      } else if (reaction.emoji.name === '❌') {
        collector.stop('user');
        mesg.edit('Pokemon inventory session ended.');
      }
    });
  }
};
