const { Command, util } = require('discord.js-commando');
const { stripIndents, oneLine } = require('common-tags');

module.exports = class InventoryCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'inventory',
      group: 'pokemon',
      memberName: 'inventory',
      description: 'Shows your or others pokemon inventory.',
      details: 'Catch pokemon with the pokemon command.\nYou can view your or others pokemon with this command.',
      examples: ['inventory', 'inventory @user'],
      guildOnly: true,
      args: [
        {
          key: 'user',
          prompt: 'Who\'s pokemon inventory would you like to view?\n',
          type: 'user',
          default: ''
        }
      ],
      throttling: {
        usages: 1,
        duration: 30
      }
    });
  }

  async run(msg, args) {
    const { embed: RichEmbed } = this.client;
    const user = args.user || msg.author;
<<<<<<< HEAD
    let inventory = await this.client.pokemon.getInventory(user.id);
    inventory = inventory.map(item => `**${item.name}** x${item.count}`);
    const paginatedItems = util.paginate(inventory, 1, 25);

    let current = 1;
    const max = Math.ceil(inventory.length / 25);

    /* eslint-disable max-len */
    const mesg = await msg.say(stripIndents`
      __**${user.username}'s Pokemon:**__ Includes **${inventory.length}/802** Pokemon. [Page 1 (25 shown)]
      ${paginatedItems.items.join('\n')}
    `, { embed: new RichEmbed().setDescription(`You may also view your inventory [here](http://toastybot.com/inventory?id=${user.id}&name=${user.username.replace(/\s/g, '%20')}&avatar=${user.avatarURL()})`) });

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
          await msg.reply("you cannot go back to a page if you're already on the first page.");
        } else {
          current -= 1;
          await mesg.edit(stripIndents`
            __**${user.username}'s Pokemon:**__ Includes **${inventory.length}/802** Pokemon. [Page 1 (25 shown)]
            ${util.paginate(inventory, current, 25).items.join('\n')}
          `, { embed: new RichEmbed().setDescription(`You may also view your inventory [here](http://toastybot.com/inventory?id=${user.id}&name=${user.username.replace(/\s/g, '%20')}&avatar=${user.avatarURL()})`) });
        }
      } else if (reaction.emoji.name === '➡') {
        if (current >= max) {
          await msg.reply("you cannot go to the next page if you're already on the last page.");
        } else {
          current += 1;
          await mesg.edit(stripIndents`
            __**${user.username}'s Pokemon:**__ Includes **${inventory.length}/802** Pokemon. [Page 1 (25 shown)]
            ${util.paginate(inventory, current, 25).items.join('\n')}
          `, { embed: new RichEmbed().setDescription(`You may also view your inventory [here](http://toastybot.com/inventory?id=${user.id}&name=${user.username.replace(/\s/g, '%20')}&avatar=${user.avatarURL()})`) });
        }
      } else if (reaction.emoji.name === '❌') {
        collector.stop('user');
        mesg.edit('', { embed: null });
        mesg.edit('Pokemon inventory session ended.');
      }
    });
=======
    const toSend = new Array();

    r.table('Pokemon')
      .get(user.id)
      .run()
      .then(async function(response) {
        try {
          const data = response[user.id].pokemon;
          Object.keys(data).forEach(key => {
            toSend.push(`**${data[key].name}** x${data[key].count}`);
          });
          function showPage(page, m) {
            if (toSend.length < 25) return m.edit(':no_entry_sign: No Pokemon on this page!');
            let start = page * 10;
            start += page;
            const stop = start + 25;
            m.edit('').then(m => {
              m.edit(`__**${user.username}'s Pokemon:**__ Includes **${toSend.length}/802** Pokemon. [Page ${page} (25 shown)]\n${toSend.slice(start, stop).join('\n')}`);
            });
            //m.edit(`__**${user.username}'s Pokemon:**__ Includes **${toSend.length}/802** Pokemon. [Page ${page} (25 shown)]\n${toSend.slice(start, stop).join('\n')}`);
            m.awaitReactions((reaction, user) => user.id === msg.author.id, {
              max: 1,
              time: 30000
            }).then(reactions => {
              if (reactions.first() == undefined) return;
              if (reactions.first().emoji.name == '➡') {
                showPage(page + 1, m);
              } else if (reactions.first().emoji.name == '⬅') {
                if (page === 1) msg.reply(':no_entry_sign: You can\'t go back a page if you\'re on page 1!');
                else showPage(page - 1, m);
              } else if (reactions.first().emoji.name == '❌') {
                return m.edit('Pokemon inventory session ended.');
              }
            }).catch(() => m.edit('Pokemon inventory session ended.'));
          }

          const m = await msg.say(`__**${user.username}'s Pokemon:**__ Includes **${toSend.length}/802** Pokemon. [Page 1] \n${toSend.slice(0, 25).join('\n')}`);
          const embed = new RichEmbed().setDescription(`You may also view your inventory [here](http://toastybot.com/inventory?id=${user.id}&name=${user.username.replace(/\s/g, '%20')}&avatar=${user.avatarURL})`);
          msg.embed(embed);
          m.react('⬅').then(() => m.react('➡').then(() => m.react('❌')));
          m.awaitReactions((reaction, user) => user.id === msg.author.id, {
            max: 1,
            time: 30000
          }).then(reactions => {
            if (reactions.first() == undefined) return;
            if (reactions.first().emoji.name == '➡') {
              showPage(2, m);
            } else if (reactions.first().emoji.name == '⬅') {
              msg.reply(':no_entry_sign: You can\'t go back a page if you\'re on page 1!');
            } else if (reactions.first().emoji.name == '❌') {
              return m.edit('Pokemon inventory session ended.');
            }
          }).catch(() => m.edit('Pokemon inventory session ended.'));
        } catch (err) {
          msg.say('That user has no Pokemon!');
        }
      })
      .error((err) => {
        msg.say(':no_entry_sign: **Error:** Failed to read inventory.\n' + err);
      });
>>>>>>> upstream/master
  }
};
