const { Command } = require('discord.js-commando');
const path = require('path');

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
    if (msg.channel.id === '208674478773895168') return msg.reply('Pokemon commands must be used in <#303206425113657344>.');
    const RichEmbed = this.client.embed;
    const r = this.client.r;
    const user = args.user || msg.author;
    let toSend = new Array();

    r.table('Pokemon')
    .get(user.id)
    .run()
    .then(async function(response) {
      try {
        let data = response[user.id].pokemon;
        Object.keys(data).forEach(key => {
          toSend.push(`**${data[key].name}** x${data[key].count}`);
        });
        function showPage(page, m) {
          if (toSend.length < 25) return m.edit(':no_entry_sign: No Pokemon on this page!');
          let start = page * 10;
          start += page;
          let stop = start + 25;
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
      } catch(err) {
        msg.say('That user has no Pokemon!');
      }
    })
    .error((err) => {
      msg.say(':no_entry_sign: **Error:** Failed to read inventory.\n' + err);
    });
  }
};
