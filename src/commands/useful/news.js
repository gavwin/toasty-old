const { Command } = require('discord.js-commando');
const { tokens } = require('../../config.json');
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(tokens.news);

module.exports = class CleanCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'news',
      group: 'useful',
      memberName: 'news',
      description: 'Get the latest news from the specified news source.',
      args: [
        {
          key: 'newsSource',
          prompt: 'What news source would you like to get your news?\n',
          type: 'string'
        }
      ],
      throttling: {
        usages: 1,
        duration: 10
      }
    });
  }

  async run(msg, args) {
    const newsSource = args.newsSource.toLowerCase();
    const source = new Object();
    if (newsSource === 'cnn') {
      source.name = 'cnn';
      source.icon = 'http://vignette3.wikia.nocookie.net/logopedia/images/0/09/CNN_International_logo_2014.svg/revision/latest/scale-to-width-down/185?cb=20161205122246';
    } else
    if (newsSource === 'hacker-news') {
      source.name = 'hacker-news';
      source.icon = 'https://news.ycombinator.com/favicon.ico';
    } else
    if (newsSource === 'techradar') {
      source.name = 'techradar';
      source.icon = 'https://s-media-cache-ak0.pinimg.com/564x/e7/d4/32/e7d43201fc36584e635a299a14823a92.jpg';
    } else
    if (newsSource === 'polygon') {
      source.name = 'polygon';
      source.icon = 'http://assets.sbnation.com/polygon/polygon-mark.png';
    } else
    if (newsSource === 'washington-post') {
      source.name = 'the-washington-post';
      source.icon = 'https://pbs.twimg.com/profile_images/753656134565785600/iQ1GX-ov.jpg';
    } else
    if (newsSource === 'buzzfeed') {
      source.name = 'buzzfeed';
      source.icon = 'https://webappstatic.buzzfeed.com/static/images/global/og-image-trending.jpg';
    } else
    if (newsSource === 'the-verge') {
      source.name = 'the-verge';
      source.icon = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/The_Verge_logo.svg/2000px-The_Verge_logo.svg.png';
    } else
    if (newsSource === 'time') {
      source.name = 'time';
      source.icon = 'https://s0.wp.com/wp-content/themes/vip/time2014/img/time-logo-og.png';
    } else
    if (newsSource === 'daily-mail') {
      source.name = 'daily-mail';
      source.icon = 'http://logos-download.com/wp-content/uploads/2016/06/The_Daily_Mail_logo_wordmark.png';
    } else
    if (newsSource === 'wsj') {
      source.name = 'the-wall-street-journal';
      source.icon = 'http://www.wsj.com/apple-touch-icon.png';
    } else
    if (newsSource === 'nytimes') {
      source.name = 'the-new-york-times';
      source.icon = 'http://www.goseekadventures.com/wp-content/uploads/2014/06/New-York-Times-Social-Logo.jpg';
    } else
    if (newsSource === 'google') {
      source.name = 'google-news';
      source.icon = 'https://lh3.googleusercontent.com/fnqDFUD0zN_T1rR-4fyiCGsn6-MVE3azzA6fgMZN5xmsNIvpNQ7NbG0sXNGovftaQhb6=w300';
    } else
    if (newsSource === 'espn') {
      source.name = 'espn';
      source.icon = 'https://pbs.twimg.com/profile_images/629351437676511232/PnAYQDx8.png';
    } else
    if (newsSource === 'reddit') {
      source.name = 'reddit-r-all';
      source.icon = 'https://lh3.googleusercontent.com/J41hsV2swVteoeB8pDhqbQR3H83NrEBFv2q_kYdq1xp9vsI1Gz9A9pzjcwX_JrZpPGsa=w300';
    } else
    if (newsSource === 'cnbc') {
      source.name = 'cnbc';
      source.icon = 'http://fm.cnbc.com/applications/cnbc.com/staticcontent/img/cnbc_logo.gif';
    } else
    if (newsSource === 'bbc') {
      source.name = 'bbc-news';
      source.icon = 'https://pbs.twimg.com/profile_images/662708106/bbc.png';
    } else
    if (newsSource === 'associated-press') {
      source.name = 'associated-press';
      source.icon = 'https://pbs.twimg.com/profile_images/461964160838803457/8z9FImcv_400x400.png';
    } else
    if (newsSource === 'mashable') {
      source.name = 'mashable';
      source.icon = 'https://yt3.ggpht.com/-QN_50PuVBvA/AAAAAAAAAAI/AAAAAAAAAAA/BTltwiK9xLg/s900-c-k-no-mo-rj-c0xffffff/photo.jpg';
    } else
    if (newsSource === 'national-geographic') {
      source.name = 'national-geographic';
      source.icon = 'http://logok.org/wp-content/uploads/2014/06/National-Geographic-logo.png';
    } else {
      return msg.reply(`:no_entry_sign: That's not a valid news source. Type ${this.client.commandPrefix}sources to get a list of avaliable news sources.`);
    }

    const embed = new this.client.embed();
    const res = await newsapi.articles({ source: source.name, sortBy: 'top' });
    embed.setColor(3447003)
      .setAuthor(`Requested by ${msg.author.username}`, source.icon)
      .setTitle(`:newspaper: Latest news from ${source.name}:`)
      .setThumbnail(`${res.articles[0]['urlToImage']}`)
      .addField('Headline 1:', `**[${res.articles[0]['title']}](${res.articles[0]['url']})**`, true)
      .addField('Headline 2:', `**[${res.articles[1]['title']}](${res.articles[1]['url']})**`, true)
      .addField('Headline 3:', `**[${res.articles[2]['title']}](${res.articles[2]['url']})**`, true)
      .addField('Headline 4:', `**[${res.articles[3]['title']}](${res.articles[3]['url']})**`, true)
      .addField('Headline 5:', `**[${res.articles[4]['title']}](${res.articles[4]['url']})**`, true)
      .setFooter('News via: newsapi.org');
    msg.embed(embed);
  }
};
