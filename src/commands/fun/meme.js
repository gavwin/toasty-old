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

  run(msg) {
    /*this.client.commands.meme++;
    const meme = Math.floor(Math.random() * (1309999 - 1290000 + 1) + 1290000);
    const embed = new this.client.embed().setColor('RANDOM').setImage(`http://images.memes.com/meme/${meme}`);
    msg.embed(embed);*/

    let meme = subreddits[Math.round(Math.random() * (subreddits.length - 1))];
    randomPuppy(meme)
      .then(url => {
        const embed = new this.client.embed()
          .setFooter(`/r/${meme}`)
          .setImage(url)
          .setColor('RANDOM');
        return msg.embed(embed);
      });
  }
};
