const { Command } = require('discord.js-commando');

module.exports = class SourcesCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'sources',
      group: 'useful',
      aliases: ['newssources'],
      memberName: 'sources',
      description: 'Sends a list of avaliable news sources for the news command.',
      throttling: {
        usages: 2,
        duration: 3
      }
    });
  }

  run(msg) {
    msg.say('Avaliable news sources for the news command are:\ncnn, time, the-verge, cnbc, nytimes, buzzfeed, washington-post, wsj, daily-mail, google, espn, reddit, bbc, associated-press, techradar, polygon, hacker-news, mashable, and national-geographic');
  }
};
