const { Command } = require('discord.js-commando');

module.exports = class PokemonCheckCommand extends Command {
  constructor(...args) {
    super(...args, {
      name: 'pcheck',
      group: 'pokemon',
      memberName: 'pcheck',
      description: 'Checks if you or a user has the specified pokemon.',
      guildOnly: true,
      args: [
        {
          key: 'pokemon',
          prompt: 'What pokemon are you checking for?\n',
          type: 'string',
          parse: arg => arg.toLowerCase()
        },
        {
          key: 'user',
          prompt: 'Who\'s pokemon would you like to check that for?\n',
          type: 'user',
          default: ''
        }
      ],
      throttling: {
        usages: 1,
        duration: 3
      }
    });
  }

  async run(msg, args) {
    const user = args.user || msg.author;
    const pokemon = this.toCapitalCase(args.pokemon);
    let inventory = await this.client.pokemon.getInventory(user.id);
    if (!inventory.length) {
      msg.reply(`${args.user ? 'that user doesn\'t' : 'you don\'t'} have any Pokemon!`);
      return;
    }

    if (inventory.some(p => p.name === pokemon)) {
      const r = this.client.r.db('Pokemon').table('Pokemon');
      const res = await r.get(user.id).run();
      let data = res[user.id].pokemon;
      let toSend = new Array();
      Object.keys(data).forEach(key => {
        if (data[key].name !== pokemon) return;
        toSend.push(`x${data[key].count}`);
      });
      msg.say(`✅ ${args.user ? `**${args.user.username}** has` : 'You have'} a **${pokemon}** (${toSend[0]})`);
      return;
    } else {
      return msg.say(`❌ ${args.user ? `**${args.user.username}** doesn't have` : 'You don\'t have'} a **${pokemon}**.`);
    }
  }

  toCapitalCase(str) {
    const toReturn = [];
    let join;
    if (str.includes('-')) join = '-';
    else join = ' ';
    const words = str.split(join);
    for (const word of words) toReturn.push(`${word.slice(0, 1).toUpperCase()}${word.slice(1, word.length)}`);
    return toReturn.join(join);
  }
};
