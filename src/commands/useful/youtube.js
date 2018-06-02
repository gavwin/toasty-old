const { Command } = require('discord.js-commando');

module.exports = class YouTubeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'youtube',
      group: 'useful',
      aliases: ['yt'],
      description: 'Get YouTube channel stats.',
      memberName: 'youtube',
      args: [
        {
          key: 'channel',
          prompt: 'What\'s the name of the YouTube channel you would like to get info on?\n',
          type: 'string'
        }
      ],
      throttling: {
        usages: 1,
        duration: 5
      }
    });
  }

  async run(msg, { channel }) {
    const { get } = this.client.snekfetch;
    const snippet = await get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${channel}&key=${this.client.config.tokens.youtube}&maxResults=1&type=channel`)
      .catch(e => msg.reply(`:no_entry_sign: Your channel was too powerful that I couldn't handle it, try again! Error: ${e}`));
    const data = await get(`https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics,brandingSettings&id=${snippet.body.items[0].id.channelId}&key=${this.client.config.tokens.youtube}`)
      .catch(e => msg.reply(`:no_entry_sign: Your channel was too powerful that I couldn't handle it, try again! Error: ${e}`));

    const sData = snippet.body.items[0];
    const dData = data.body.items[0];

    const embed = new this.client.embed()
      .setColor('#FE0000')
      .setAuthor('YouTube Channel Statistics', 'https://pbs.twimg.com/profile_images/985908628329771008/QGaAYux6_400x400.jpg')
      .setThumbnail(sData.snippet.thumbnails.high.url)
      .setDescription([
        `❯ **Channel Name:** ${sData.snippet.channelTitle}`,
        `❯ **Channel Description:** ${sData.snippet.description}\n`,
        `❯ **Subscriber Count:** ${parseInt(dData.statistics.subscriberCount).toLocaleString()}`,
        `❯ **Total Views:** ${parseInt(dData.statistics.viewCount).toLocaleString()}`,
        `❯ **Total Videos:** ${parseInt(dData.statistics.videoCount).toLocaleString()}`,
        `❯ **Channel Created:** ${new Date(sData.snippet.publishedAt).toDateString()}\n`,
        `❯ **Link:** [YouTube.com/${sData.snippet.channelTitle}](https://www.youtube.com/channel/${sData.id.channelId})`
      ]);
    msg.embed(embed);
  }
};
