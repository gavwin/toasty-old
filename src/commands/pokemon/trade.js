const { Command } = require('discord.js-commando');

module.exports = class TradeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'trade',
      group: 'pokemon',
      memberName: 'trade',
      description: '[DISABLED] Trade your Pokemon with another user\'s Pokemon.',
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
    const RichEmbed = this.client.embed;
    if (!msg.guild.me.hasPermission('USE_EXTERNAL_EMOJIS')) return msg.reply(':no_entry_sign: I don\'t have **External Emojies** permission to use this cmd!');
    if (!msg.guild.me.hasPermission('EMBED_LINKS')) return msg.reply(':no_entry_sign: I don\'t have **Embed Links** permission to use this cmd!');

    /*const xmark = this.client.emojis.get('345201622827139082');
    const checkmark = this.client.emojis.get('345201601427800064');*/

    const inventory = await this.client.pokemon.getInventory(msg.author.id);
    if (!inventory.length) return msg.reply(':no_entry_sign: you don\'t have any Pokemon to trade!');
    const inventory1 = await this.client.pokemon.getInventory(user.id);
    if (!inventory1.length) return msg.reply(':no_entry_sign: that user doesn\'t have any Pokemon to trade!');

    if (pokemon1.toLowerCase() === pokemon2.toLowerCase()) return msg.reply('you cannot trade the same Pokemon, silly!');

    const hasPokemon = await this.client.pokemon.hasPokemon(msg.author.id, pokemon1),
      hasPokemon1 = await this.client.pokemon.hasPokemon(user.id, pokemon2);

    if (!hasPokemon) {
      return msg.reply('you don\'t have that Pokemon!');
    }
    if (!hasPokemon1) {
      return msg.reply('that user doesn\'t have that Pokemon!');
    }

    if (msg.author.id === '263105387912232979') {
      return msg.channel.send('Yea.. Your inventory has been cleared due to abusement of the beta-cmd w/o telling my dev!');
    } else {
      await msg.reply('are you sure you want to trade that pokemon? Respond with `yes` or `no`');
      const filter = m => m.author.id === msg.author.id && ['yes', 'y', 'no', 'n'].includes(m.content.toLowerCase());
      const collected = await msg.channel.awaitMessages(filter, { time: 30e3, errors: ['time'], max: 1 })
        .catch(() => msg.reply(':no_entry_sign: Time ran out... Aborted command.'));

      if (['y', 'yes'].includes(collected.first().content.toLowerCase())) {
        const filter1 = m => m.author.id === user.id && ['yes', 'y', 'no', 'n'].includes(m.content.toLowerCase());
        await msg.say(`${user}, are you sure you want to trade that pokemon? Respond with \`yes\` or \`no\``);
        const collected1 = await msg.channel.awaitMessages(filter1, { time: 30e3, errors: ['time'], max: 1 })
          .catch(() => msg.reply(':no_entry_sign: Time ran out... Aborted command.'));

        if (['y', 'yes'].includes(collected1.first().content.toLowerCase())) {
          try {
            const toAdd = toCapitalCase(pokemon2);
            const toAdd1 = toCapitalCase(pokemon1);
            await Promise.all([
              await this.client.pokemon.addPokemonForce(toAdd1, user),
              await this.client.pokemon.removePokemon(toAdd1, msg.author),
            ]).then(async () => {
              setTimeout(async () => {
                await Promise.all([
                  await this.client.pokemon.addPokemonForce(toAdd, msg.author),
                  await this.client.pokemon.removePokemon(toAdd, user),
                ]);
              }, 1000);
            });
            return msg.reply(`:white_check_mark: You've successfully traded your **${toAdd1}** for a **${toAdd}**!`);
          } catch (err) {
            this.client.emit('commandError', this, err);
            return msg.reply(':no_entry_sign: An error occurred while trading that Pokemon! My developer has been notified.');
          }
        } else if (['n', 'no'].includes(collected1.first().content.toLowerCase())) {
          return msg.reply(':no_entry_sign: Cancelled trade.');
        } else {
          return msg.reply(':no_entry_sign: That was not a valid option! Aborting trade...');
        }
      } else if (['n', 'no'].includes(collected.first().content.toLowerCase())) {
        return msg.reply(':no_entry_sign: Cancelled trade.');
      } else {
        return msg.reply(':no_entry_sign: That was not a valid option! Aborting trade...');
      }
    }
  }
};

function toCapitalCase(str) {
  const words = str.split(' ');
  const toReturn = [];
  for (const word of words) {
    toReturn.push(`${word.slice(0, 1).toUpperCase()}${word.slice(1, word.length)}`);
  }
  return toReturn.join(' ');
}
