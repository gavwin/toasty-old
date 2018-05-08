const { Command } = require('discord.js-commando');
const randomPuppy = require('random-puppy');

const subreddits = [
    'memes',
    'DeepFriedMemes',
    'bonehurtingjuice',
    'surrealmemes',
    'dankmemes',
    'meirl',
    'me_irl',
    'funny'
];

module.exports = class MemeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'meme',
      group: 'fun',
      memberName: 'meme',
      description: 'Sends a random meme from a subreddit.',
      throttling: {
        usages: 1,
        duration: 4
      }
    });
  }

  async run(msg) {
    let meme = subreddits[Math.round(Math.random() * (subreddits.length - 1))];
    let url = await randomPuppy(meme);
    const embed = new this.client.embed()
      .setFooter(`/r/${meme}`)
      .setImage(url)
      .setColor('RANDOM');
    msg.embed(embed);
  }
};
