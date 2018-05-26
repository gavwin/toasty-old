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
        duration: 15
      }
    });
  }

  async run(msg, args) {
    if (!msg.guild.me.permissions.has('ADD_REACTIONS')) return msg.reply(':no_entry_sign: [**Missing Permissions**]: I don\'t have the **Add Reactions** permission!');
    if (!msg.guild.me.permissions.has('EMBED_LINKS')) return msg.reply(':no_entry_sign: [**Missing Permissions**]: I don\'t have the **Embed Links** permission!');
    const { embed: RichEmbed } = this.client;
    const user = args.user || msg.author;
    let inventory = await this.client.pokemon.getInventory(user.id);
    if (!inventory.length) {
      msg.reply(`${args.user ? 'that user doesn\'t' : 'you don\'t'} have any Pokemon!`);
      return;
    }

    if (user.username.includes('(')) user.username = user.username.replace('(', '');
    if (user.username.includes(')')) user.username = user.username.replace(')', '');
    const invURL = `http://toastybot.com/inventory?id=${user.id}&name=${user.username.replace(/\s/g, '%20')}&avatar=${user.avatarURL()}`;

    inventory = inventory.map(item => `**${item.name}** x${item.count}`);
    const paginatedItems = util.paginate(inventory, 1, 25);

    let current = 1;
    const max = Math.ceil(inventory.length / 25);

    /* eslint-disable max-len */
    const mesg = await msg.say(stripIndents`
      __**${user.username}'s Pokemon:**__ Includes **${inventory.length}/802** Pokemon. [Page 1 (25 shown)]
      ${paginatedItems.items.join('\n')}
    `, { embed: new RichEmbed().setDescription(`You may also view your inventory [here](${invURL})`) });

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
            __**${user.username}'s Pokemon:**__ Includes **${inventory.length}/802** Pokemon. [Page 1 (25 shown)]
            ${util.paginate(inventory, current, 25).items.join('\n')}
          `, { embed: new RichEmbed().setDescription(`You may also view your inventory [here](${invURL})`) });
        }
      } else if (reaction.emoji.name === '➡') {
        if (current >= max) {
          await msg.reply('you cannot go to the next page if you\'re already on the last page.');
        } else {
          current += 1;
          await mesg.edit(stripIndents`
            __**${user.username}'s Pokemon:**__ Includes **${inventory.length}/802** Pokemon. [Page 1 (25 shown)]
            ${util.paginate(inventory, current, 25).items.join('\n')}
          `, { embed: new RichEmbed().setDescription(`You may also view your inventory [here](${invURL})`) });
        }
      } else if (reaction.emoji.name === '❌') {
        collector.stop('user');
        mesg.edit('', { embed: null });
        mesg.edit('Pokemon inventory session ended.');
      }
    });
  }
};
