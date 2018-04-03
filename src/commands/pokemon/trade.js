const { Command } = require('discord.js-commando');
const events = require('events');
const pokemonEvent = new events.EventEmitter();

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
          type: 'string'
        },
        {
          key: 'pokemon2',
          prompt: 'What Pokemon will they trade with you?\n',
          type: 'string'
        }
      ],
      throttling: {
        usages: 1,
        duration: 60
      }
    });
  }

  async run(msg, args) {
    return msg.reply('the trade command has been disabled due to some bugs.');
    /* eslint-disable */
    // To be looked at in a later PR
    const RichEmbed = this.client.embed;
      if(msg.author.id !== '316241705689022464') return;
        const botMember = await msg.guild.fetchMember(this.client.user);
      if (!botMember.hasPermission('USE_EXTERNAL_EMOJIS')) return msg.reply(':no_entry_sign: I don\'t have **External Emojies** permission to use this cmd!');
          if (!botMember.hasPermission('EMBED_LINKS')) return msg.reply(':no_entry_sign: I don\'t have **Embed Links** permission to use this cmd!');

                const xmark = this.client.emojis.get('345201622827139082');
                const checkmark = this.client.emojis.get('345201601427800064');

  if(msg.author.id === '263105387912232979') {
    msg.channel.send('Yea.. Your inventory has been cleared due to abusement of the beta-cmd w/o telling my dev!')
  } else {
      let { user, pokemon1, pokemon2 } = args;
      r.table('Pokemon')
      .get(msg.author.id)
      .run()
      .then((response1) => {
        //console.log(response);
        r.table('Pokemon')
        .get(user.id)
        .run()
        .then((response2) => {
        let aData = response1[msg.author.id];
        let bData = response2[user.id];
        function cap(text) {
          return text.charAt(0).toUpperCase() + text.slice(1);
        }
        pokemon1 = cap(pokemon1);
        pokemon2 = cap(pokemon2);
        if (!aData) return msg.reply(`${xmark} You can\'t trade Pokemon if you have no Pokemon!`);
        if (!bData) return msg.say(`<@${user.id}>, ${xmark} You can't trade if you have no Pokemon!`);

        if (!aData.pokemon[pokemon1]) return msg.reply(`${xmark} You don\'t have **${pokemon1}** so you can't trade it!`);
        if (!bData.pokemon[pokemon2]) return msg.say(`<@${user.id}>, ${xmark} You don\'t have **${pokemon2}** so you can't trade it!`);

        const trade = function trade() {
          if (aData.pokemon[pokemon2]) {
            let count = aData.pokemon[pokemon1].count;
            r.table('Pokemon')
            .get(msg.author.id)
            .update(
              {[msg.author.id]: {pokemon: {[pokemon1]: {count: count++}}}}
            )
            .run();
          } else {
            r.table('Pokemon')
            .get(msg.author.id)
            .update(
              {[msg.author.id]: {pokemon: {[pokemon2]: {name: pokemon2, count: 1, gif: `http://www.pokestadium.com/sprites/xy/${pokemon2.toLowerCase()}.gif`}}}}
            )
            .run();
          }

          if (bData.pokemon[pokemon1]) {
            let count = bData.pokemon[pokemon1].count;
            r.table('Pokemon')
            .get(user.id)
            .update(
              {[user.id]: {pokemon: {[pokemon1]: {count: count++}}}}
            )
            .run();
          } else {
            r.table('Pokemon')
            .get(user.id)
            .update(
              {[user.id]: {pokemon: {[pokemon1]: {name: pokemon1, count: 1, gif: `http://www.pokestadium.com/sprites/xy/${pokemon1.toLowerCase()}.gif`}}}}
            )
            .run();
          }

          if (aData.pokemon[pokemon1].count > 1) {
            let count = aData.pokemon[pokemon1].count;
            r.table('Pokemon')
            .get(msg.author.id)
            .update(
              {[msg.author.id]: {pokemon: {[pokemon1]: {count: count--}}}}
            )
            .run();
          } else {
            r.table('Pokemon')
            .get(msg.author.id)
            .delete()
            .run()
            .then((response) => {
              //console.log('Successfully updated count for pokemon.', response);
              delete aData.pokemon[pokemon1];
              aData.pokemon[pokemon2] = {
                name: pokemon2,
                count: 1,
                gif: `http://www.pokestadium.com/sprites/xy/${pokemon2.toLowerCase()}.gif`
              };
              r.table('Pokemon')
              .insert({
                id: msg.author.id,
                [msg.author.id]: aData
              })
              .run();
            })
            .error((err) => {
              //console.log('Failed to update count for pokemon.', err);
            });
          }

          if (bData.pokemon[pokemon2].count > 1) {
            let count = bData.pokemon[pokemon2].count;
            r.table('Pokemon')
            .get(user.id)
            .update(
              {[user.id]: {pokemon: {[pokemon2]: {count: count--}}}}
            )
            .run()
          } else {
            r.table('Pokemon')
            .get(user.id)
            .delete()
            .run()
            .then((response) => {
              //console.log('Successfully updated count for pokemon.', response);
              delete bData.pokemon[pokemon2];
              bData.pokemon[pokemon1] = {
                name: pokemon1,
                count: 1,
                gif: `http://www.pokestadium.com/sprites/xy/${pokemon1.toLowerCase()}.gif`
              };
              r.table('Pokemon')
              .insert({
                id: user.id,
                [user.id]: bData
              })
              .run();
            })
            .error((err) => {
              //console.log('Failed to update count for pokemon.', err);
            });
          }

          msg.say(`${checkmark} **${msg.author.username}**#${msg.author.discriminator} has successfully traded a **${pokemon1}** for a **${pokemon2}** with **${user.username}**#${user.discriminator}!`)
        }

        const embed1 = new RichEmbed();
        embed1.setColor(0xFF0000)
          .setTitle('Pokemon Trade Confirmation')
          .setDescription(`Between ${msg.author.tag} and ${user.tag}`)
          .setAuthor(msg.author.username, msg.author.avatarURL)
          .addField(`Do you confirm to trade your **${pokemon1}** with **${user.username}**'s **${pokemon2}**?`, '**__y__es** or **__n__o**?');
        msg.embed(embed1);

       msg.channel.awaitMessages(response => ['y', 'yes', 'n', 'no', 'cancel'].includes(response.content.toLowerCase()) && response.author.id === msg.author.id, {
          max: 1,
          time: 15000
        }).then(async (collected) => {
          const co = new Array();
          const coMap = collected.map((m) => co.push(m));

     if (msg.content.includes("No", "no", "cancel", "CANCEL", "NO", "Cancel", "N")){
                  return msg.say(`Okay. Cancelling trade between **${msg.author.username}** and **${user.username}**.`);
     }

          if (['yes', 'y', 'Y'].includes(co[0].content) && co[0].author.id === msg.author.id) {
            msg.say(`<@${co[0].author.id}>, ${checkmark} okay.`);

            const embed2 = new RichEmbed();
            embed2.setColor(0xE84E4E)
              .setTitle('Pokemon Trade Confirmation')
              .setDescription(`Between ${msg.author.tag} and ${user.tag}`)
              .setAuthor(user.username, user.avatarURL)
              .addField(`Do you confirm to trade your **${pokemon2}** with **${msg.author.username}**'s **${pokemon1}**?`, '**__y__es** or **__n__o**?');
            msg.embed(embed2);

            msg.channel.awaitMessages(m => ['y', 'yes', 'n', 'no', 'cancel'].includes(m.content.toLowerCase()) && m.author.id === user.id, {
              max: 1,
              time: 15000
            }).then(async (collected1) => {
              const co1 = new Array();
              const co1Map = collected1.map((m) => co1.push(m));
              try {
                if (['y', 'yes', 'Y'].includes(co1[0].content.toLowerCase()) && co1[0].author.id === user.id) {
                  msg.say(`<@${co1[0].author.id}>, ${checkmark} okay.`).then();
                    pokemonEvent.once('secondConfirm', trade);
                   pokemonEvent.emit('secondConfirm');
                } else if (['n', 'no', 'cancel', 'N'].incudes(co1[0].content.toLowerCase()) && co1[0].author.id === user.id) {
                  return msg.say(`Okay. Cancelling trade between **${msg.author.username}** and **${user.username}**.`);
                }
              } catch(err) { //try catch b/c of unknown ['n', 'no', 'cancel'].includes is not a func error
                return msg.say(`Okay. Cancelling trade between **${msg.author.username}** and **${user.username}**.`);
              }
            }).catch(() => msg.say(`Cancelling trade between **${msg.author.username}** and **${user.username}**. Took longer than 15 seconds for a reply.`));

          } else if (['N', 'n', 'no', 'cancel', 'CANCEL'].incudes(co[0].content.toLowerCase()) && co[0].author.id === msg.author.id) {
            return msg.say(`Okay. Cancelling trade between **${msg.author.username}** and **${user.username}**.`);
          }

          pokemonEvent.once('secondConfirm', trade);

        }).catch(() => msg.say(`Cancelling trade between **${msg.author.username}** and **${user.username}**. Took longer than 15 seconds for a reply.`));
      })
      .error((err) => {
        msg.say(`${xmark} **Error:** Failed to read inventory.\n` + err);
      });
      })
      .error((err) => {
        msg.say(`${xmark} **Error:** Failed to read inventory.\n` + err);
      });
  }
    /*const r = this.client.r;
    let { user, pokemon1, pokemon2 } = args;
    if (user.id === msg.author.id) return msg.reply(':no_entry_sign: You can not trade with yourself!');
    r.table('Pokemon')
    .get(msg.author.id)
    .run()
    .then((response1) => {
      //console.log(response);
      r.table('Pokemon')
      .get(user.id)
      .run()
      .then((response2) => {
      let aData = response1[msg.author.id];
      let bData = response2[user.id];
      function cap(text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
      }
      pokemon1 = cap(pokemon1);
      pokemon2 = cap(pokemon2);
      if (!aData) return msg.reply(':no_entry_sign: You can\'t trade Pokemon if you have no Pokemon!');
      if (!bData) return msg.say(`<@${user.id}>, :no_entry_sign: You can't trade if you have no Pokemon!`);

      if (!aData.pokemon[pokemon1]) return msg.reply(`:no_entry_sign: You don\'t have **${pokemon1}** so you can't trade it!`);
      if (!bData.pokemon[pokemon2]) return msg.say(`<@${user.id}>, :no_entry_sign: You don\'t have **${pokemon2}** so you can't trade it!`);

      const trade = function trade() {
        if (aData.pokemon[pokemon2]) {
          let count = aData.pokemon[pokemon1].count;
          r.table('Pokemon')
          .get(msg.author.id)
          .update(
            {[msg.author.id]: {pokemon: {[pokemon1]: {count: count++}}}}
          )
          .run();
        } else {
          r.table('Pokemon')
          .get(msg.author.id)
          .update(
            {[msg.author.id]: {pokemon: {[pokemon2]: {name: pokemon2, count: 1, gif: `http://www.pokestadium.com/sprites/xy/${pokemon2.toLowerCase()}.gif`}}}}
          )
          .run();
        }

        if (bData.pokemon[pokemon1]) {
          let count = bData.pokemon[pokemon1].count;
          r.table('Pokemon')
          .get(user.id)
          .update(
            {[user.id]: {pokemon: {[pokemon1]: {count: count++}}}}
          )
          .run();
        } else {
          r.table('Pokemon')
          .get(user.id)
          .update(
            {[user.id]: {pokemon: {[pokemon1]: {name: pokemon1, count: 1, gif: `http://www.pokestadium.com/sprites/xy/${pokemon1.toLowerCase()}.gif`}}}}
          )
          .run();
        }

        if (aData.pokemon[pokemon1].count > 1) {
          let count = aData.pokemon[pokemon1].count;
          r.table('Pokemon')
          .get(msg.author.id)
          .update(
            {[msg.author.id]: {pokemon: {[pokemon1]: {count: count--}}}}
          )
          .run();
        } else {
          r.table('Pokemon')
          .get(msg.author.id)
          .delete()
          .run()
          .then((response) => {
            //console.log('Successfully updated count for pokemon.', response);
            delete aData.pokemon[pokemon1];
            aData.pokemon[pokemon2] = {
              name: pokemon2,
              count: 1,
              gif: `http://www.pokestadium.com/sprites/xy/${pokemon2.toLowerCase()}.gif`
            };
            r.table('Pokemon')
            .insert({
              id: msg.author.id,
              [msg.author.id]: aData
            })
            .run();
          })
          .error((err) => {
            //console.log('Failed to update count for pokemon.', err);
          });
        }

        if (bData.pokemon[pokemon2].count > 1) {
          let count = bData.pokemon[pokemon2].count;
          r.table('Pokemon')
          .get(user.id)
          .update(
            {[user.id]: {pokemon: {[pokemon2]: {count: count--}}}}
          )
          .run()
        } else {
          r.table('Pokemon')
          .get(user.id)
          .delete()
          .run()
          .then((response) => {
            //console.log('Successfully updated count for pokemon.', response);
            delete bData.pokemon[pokemon2];
            bData.pokemon[pokemon1] = {
              name: pokemon1,
              count: 1,
              gif: `http://www.pokestadium.com/sprites/xy/${pokemon1.toLowerCase()}.gif`
            };
            r.table('Pokemon')
            .insert({
              id: user.id,
              [user.id]: bData
            })
            .run();
          })
          .error((err) => {
            //console.log('Failed to update count for pokemon.', err);
          });
        }

        msg.say(`:white_check_mark: **${msg.author.username}**#${msg.author.discriminator} has successfully traded a **${pokemon1}** for a **${pokemon2}** with **${user.username}**#${user.discriminator}!`)
      }

      const embed1 = new this.client.embed();
      embed1.setColor(0xFF0000)
        .setTitle('Pokemon Trade Confirmation')
        .setDescription(`Between ${msg.author.tag} and ${user.tag}`)
        .setAuthor(msg.author.username, msg.author.avatarURL)
        .addField(`Do you confirm to trade your **${pokemon1}** with **${user.username}**'s **${pokemon2}**?`, '**__y__es** or **__n__o**?');
      msg.embed(embed1);

     msg.channel.awaitMessages(response => ['y', 'yes', 'n', 'no', 'cancel'].includes(response.content.toLowerCase()) && response.author.id === msg.author.id, {
  			max: 1,
  			time: 15000
  		}).then(async (collected) => {
        const co = new Array();
        const coMap = collected.map((m) => co.push(m));

  			if (['yes', 'y'].includes(co[0].content) && co[0].author.id === msg.author.id) {
          msg.say(`<@${co[0].author.id}>, :white_check_mark: okay.`);

          const embed2 = new this.client.embed();
          embed2.setColor(0xFF0000)
            .setTitle('Pokemon Trade Confirmation')
            .setDescription(`Between ${msg.author.tag} and ${user.tag}`)
            .setAuthor(user.username, user.avatarURL)
            .addField(`Do you confirm to trade your **${pokemon2}** with **${msg.author.username}**'s **${pokemon1}**?`, '**__y__es** or **__n__o**?');
          msg.embed(embed2);

          msg.channel.awaitMessages(m => ['y', 'yes', 'n', 'no', 'cancel'].includes(m.content.toLowerCase()) && m.author.id === user.id, {
         		max: 1,
         	  time: 15000
         	}).then(async (collected1) => {
            const co1 = new Array();
            const co1Map = collected1.map((m) => co1.push(m));
            try {
              if (['yes', 'y'].includes(co1[0].content.toLowerCase()) && co1[0].author.id === user.id) {
                msg.say(`<@${co1[0].author.id}>, :white_check_mark: okay.`);
                pokemonEvent.emit('secondConfirm');
              } else if (['n', 'no', 'cancel'].incudes(co1[0].content.toLowerCase()) && co1[0].author.id === user.id) {
                return msg.say(`Okay. Cancelling trade between **${msg.author.username}** and **${user.username}**.`);
              }
            } catch(err) { //try catch b/c of unknown ['n', 'no', 'cancel'].includes is not a func error
              return msg.say(`Okay. Cancelling trade between **${msg.author.username}** and **${user.username}**.`);
            }
          }).catch(() => msg.say(`Cancelling trade between **${msg.author.username}** and **${user.username}**. Took longer than 15 seconds for a reply.`));

        } else if (['n', 'no', 'cancel'].incudes(co[0].content.toLowerCase()) && co[0].author.id === msg.author.id) {
          return msg.say(`Okay. Cancelling trade between **${msg.author.username}** and **${user.username}**.`);
        }

        pokemonEvent.once('secondConfirm', trade);

  		}).catch(() => msg.say(`Cancelling trade between **${msg.author.username}** and **${user.username}**. Took longer than 15 seconds for a reply.`));
    })
    .error((err) => {
      msg.say(':no_entry_sign: **Error:** Failed to read inventory.\n' + err);
    });
    })
    .error((err) => {
      msg.say(':no_entry_sign: **Error:** Failed to read inventory.\n' + err);
    });
*/
//msg.reply('This command is temporarily disabled.');
  }
};
