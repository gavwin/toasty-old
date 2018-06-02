const { Command } = require('discord.js-commando');

module.exports = class FortniteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'fortnite',
      group: 'useful',
      description: 'Get fortnite stats.',
      memberName: 'fortnite',
      args: [
        {
          key: 'username',
          prompt: 'What\'s the username of the user you would like to get fortnite stats on?\n',
          type: 'string'
        },
        {
          key: 'platform',
          prompt: 'What platform does this user play on?\npc, xbox or psn',
          type: 'string',
          parse: arg => arg.toLowerCase()
        }
      ],
      throttling: {
        usages: 1,
        duration: 7
      }
    });
  }

  async run(msg, { username, platform }) {
    try {
      const { get } = this.client.snekfetch;
      let data;
      if (platform === 'pc') {
        data = await get(`https://api.fortnitetracker.com/v1/profile/pc/${username}`)
          .set('TRN-Api-Key', this.client.config.tokens.fortnite);
        } else if (platform === 'xbox') {
          data = await get(`https://api.fortnitetracker.com/v1/profile/xb1/${username}`)
            .set('TRN-Api-Key', this.client.config.tokens.fortnite);
        } else if (platform === 'psn') {
          data = await get(`https://api.fortnitetracker.com/v1/profile/psn/${username}`)
            .set('TRN-Api-Key', this.client.config.tokens.fortnite);
        } else {
          return msg.say(':no_entry_sign: **Invalid platform, please retry with either of these platforms: `pc`. `xbox`, `psn`.**');
        }

        if (!data) return msg.say(':no_entry_sign: **Invalid username or platform, please retry with either of these platforms: `pc`. `xbox`, `psn`.**');
        if (data.body.error) return msg.say(':no_entry_sign: **There was an error in the Tracking API, please try again later.**');

        const embed = new this.client.embed()
          .setTitle('Fortnite Battle Royale Statistics')
          .setThumbnail('https://i.imgur.com/EER1jFB.png')
          .setColor('#151842')
          .setDescription([
            `? **Epic Username:** ${data.body.epicUserHandle}`,
            `? **Score:** ${data.body.lifeTimeStats.find(a => a.key === 'Score').value}`,
            `? **Matches Played:** ${data.body.lifeTimeStats.find(a => a.key === 'Matches Played').value}`,
            `? **Kills:** ${data.body.lifeTimeStats.find(a => a.key === 'Kills').value}`,
            `? **Wins:** ${data.body.lifeTimeStats.find(a => a.key === 'Wins').value}`,
            `? **K/D:** ${data.body.lifeTimeStats.find(a => a.key === 'K/d').value}`,
            `? **Top 3:** ${data.body.lifeTimeStats.find(a => a.key === 'Top 3').value}`,
            `? **platform:** ${data.body.platformNameLong}`
          ]);
        msg.embed(embed);
      } catch(err) {
        return msg.say(':no_entry_sign: **There was an error in the Tracking API, please try again later.**');
      }
  }
};
