const { Command } = require('discord.js-commando');

module.exports = class TradeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'trade',
      group: 'pokemon',
      memberName: 'trade',
      description: 'Trade your Pokemon with another user\'s Pokemon.',
      details: 'Catch pokemon with the pokemon command.\nYou can trade the pokemon you catch with this command.',
      examples: ['trade @user pikachu charzard'],
      guildOnly: true,
      args: [
        {
          key: 'user',
          prompt: 'Who would you like to trade Pokemon with?\n',
          type: 'user'
        },
        {
          key: 'pokemon1',
          prompt: 'What Pokemon will you trade with them?\n',
          type: 'string',
          parse: arg => arg.toLowerCase()
        },
        {
          key: 'pokemon2',
          prompt: 'What Pokemon will they trade with you?\n',
          type: 'string',
          parse: arg => arg.toLowerCase()
        }
      ],
      throttling: {
        usages: 1,
        duration: 60
      }
    });
  }

  async run(msg, args) {
    const { user, pokemon1, pokemon2 } = args;
    const trading = new Array();
    function notTrading(id, trading) {
      try {
        let index = trading.indexOf(id);
        trading.splice(id, 1);
      } catch(err) { }
    }

    if (!msg.guild.me.hasPermission('USE_EXTERNAL_EMOJIS')) return msg.reply(':no_entry_sign: I don\'t have **External Emojies** permission to use this cmd!');
    if (!msg.guild.me.hasPermission('EMBED_LINKS')) return msg.reply(':no_entry_sign: I don\'t have **Embed Links** permission to use this cmd!');

    /*const xmark = this.client.emojis.get('345201622827139082');
    const checkmark = this.client.emojis.get('345201601427800064');*/

    if (msg.author.id === user.id) return msg.reply(':no_entry_sign: You cannot trade pokemon with yourself!');

    const inventory = await this.client.pokemon.getInventory(msg.author.id);
    if (!inventory.length) return msg.reply(':no_entry_sign: you don\'t have any Pokemon to trade!');
    const inventory1 = await this.client.pokemon.getInventory(user.id);
    if (!inventory1.length) return msg.reply(':no_entry_sign: that user doesn\'t have any Pokemon to trade!');

    if (pokemon1.toLowerCase() === pokemon2.toLowerCase()) return msg.reply('you cannot trade the same Pokemon, silly!');

    if (trading.includes(msg.author.id)) return msg.reply(':no_entry_sign: Nice try but you cannot trade when you are already trading with someone!');
    if (trading.includes(user.id)) return msg.say(`${user}, :no_entry_sign: Nice try but you cannot trade when you are already trading with someone!`);

    const hasPokemon = await this.client.pokemon.hasPokemon(msg.author.id, pokemon1),
      hasPokemon1 = await this.client.pokemon.hasPokemon(user.id, pokemon2);

    if (!hasPokemon) return msg.reply('you don\'t have that Pokemon!');
    if (!hasPokemon1) return msg.reply('that user doesn\'t have that Pokemon!');


    trading.push(msg.author.id);
    trading.push(user.id);
    await msg.reply('are you sure you want to trade that pokemon? Respond with `yes` or `no`');
    const filter = m => m.author.id === msg.author.id && ['yes', 'y', 'no', 'n'].includes(m.content.toLowerCase());
    return msg.channel.awaitMessages(filter, { time: 30e3, errors: ['time'], max: 1 })
      .then(async collected => {
        if (!collected.size) {
          msg.reply('you didn\'t respond in time!');
          notTrading(msg.author.id, trading);
          notTrading(user.id, trading);
          return;
        }
        if (['y', 'yes'].includes(collected.first().content.toLowerCase())) {
          const filter1 = m => m.author.id === user.id && ['yes', 'y', 'no', 'n'].includes(m.content.toLowerCase());
          await msg.say(`${user}, are you sure you want to trade that pokemon? Respond with \`yes\` or \`no\``);
          const collected1 = await msg.channel.awaitMessages(filter1, { time: 30e3, errors: ['time'], max: 1 })
            .catch(() => {
              msg.reply(':no_entry_sign: Time ran out... Aborted command.');
              notTrading(msg.author.id, trading);
              notTrading(user.id, trading);
            });

          if (['y', 'yes'].includes(collected1.first().content.toLowerCase())) {
            try {
              const toAdd = toCapitalCase(pokemon2);
              const toAdd1 = toCapitalCase(pokemon1);
              await Promise.all([
                await this.client.pokemon.addPokemonForce(toAdd1, user.id),
                await this.client.pokemon.removePokemon(toAdd1, msg.author.id),
              ]).then(async () => {
                setTimeout(async () => {
                  await Promise.all([
                    await this.client.pokemon.addPokemonForce(toAdd, msg.author.id),
                    await this.client.pokemon.removePokemon(toAdd, user.id),
                  ]);
                }, 1000);
              });
              msg.reply(`:white_check_mark: You've successfully traded your **${toAdd1}** for a **${toAdd}**!`);
              notTrading(msg.author.id, trading);
              notTrading(user.id, trading);
              return;
            } catch (err) {
              this.client.emit('commandError', this, err);
              msg.reply(':no_entry_sign: An error occurred while trading that Pokemon! My developer has been notified.');
              notTrading(msg.author.id, trading);
              notTrading(user.id, trading);
              return;
            }
          } else if (['n', 'no'].includes(collected1.first().content.toLowerCase())) {
            msg.reply(':no_entry_sign: Cancelled trade.');
            notTrading(msg.author.id, trading);
            notTrading(user.id, trading);
            return;
          } else {
            msg.reply(':no_entry_sign: That was not a valid option! Aborting trade...');
            notTrading(msg.author.id, trading);
            notTrading(user.id, trading);
            return;
          }
        } else if (['n', 'no'].includes(collected.first().content.toLowerCase())) {
          msg.reply(':no_entry_sign: Cancelled trade.');
          notTrading(msg.author.id, trading);
          notTrading(user.id, trading);
          return;
        } else {
          msg.reply(':no_entry_sign: That was not a valid option! Aborting trade...');
          notTrading(msg.author.id, trading);
          notTrading(user.id, trading);
          return;
        }
      })
      .catch(() => {
        msg.reply(':no_entry_sign: Time ran out... Aborted command.');
        notTrading(msg.author.id, trading);
        notTrading(user.id, trading);
      });

  }
};

function toCapitalCase(str) {
  const toReturn = [];
  let join;
  if (str.includes('-')) join = '-';
  else join = ' ';
  const words = str.split(join);
  for (const word of words) toReturn.push(`${word.slice(0, 1).toUpperCase()}${word.slice(1, word.length)}`);
  return toReturn.join(join);
}
