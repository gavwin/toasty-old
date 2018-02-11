const { Command } = require('discord.js-commando');
const urban = require('urban');

module.exports = class UrbanCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'urban',
      group: 'useful',
      memberName: 'urban',
      description: 'Find definitions on the Urban Dictionary.',
      args: [
        {
          key: 'query',
          prompt: 'What word do you want to define?',
          type: 'string'
        }
      ],
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  async run(msg, args) {
    urban(args.query).first(async (json) => {
      if (json == undefined) return msg.say('**No Results Found!**');
      const embed = new this.client.embed();
      embed.setAuthor(`Urban Search - ${json.word}`, 'https://i.imgur.com/miYLsGw.jpg')
        .setColor('RANDOM')
        .addField('Definition', json.definition.length <= 1024 ? json.definition : `Truncated due to exceeding maximum length\n${json.definition.slice(0,970)}`, false)
        .addField('Example', json.example.length <= 1024 ? json.example : `Truncated due to exceeding maximum length\n${json.example.slice(0,970)}`, false)
        .addField('Permalink', json.permalink, false);
      await msg.embed(embed);
    });
  }
};
