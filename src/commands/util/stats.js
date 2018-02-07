const { Command } = require('discord.js-commando');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
require('moment-duration-format');

module.exports = class StatsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'stats',
      group: 'util',
      memberName: 'stats',
      description: 'Sends detailed statistics of the bot.',
      throttling: {
        usages: 1,
        duration: 15
      }
    });
  }

  async run(msg) {
    const m = await msg.say('```Fetching my stats...```');

    const statsData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'stats.json')));
    let guilds = await this.client.shard.fetchClientValues('guilds.size');
    guilds = guilds.reduce((prev, val) => prev + val, 0);
    let users = await this.client.shard.fetchClientValues('users.size');
    users = users.reduce((prev, val) => prev + val, 0);
    let channels = await this.client.shard.fetchClientValues('channels.size');
    channels = channels.reduce((prev, val) => prev + val, 0);
    let voiceConnections = await this.client.shard.fetchClientValues('voiceConnections.size');
    voiceConnections = voiceConnections.reduce((prev, val) => prev + val, 0);
    let sessionGuilds = await this.client.shard.fetchClientValues('session.guilds');
    sessionGuilds = sessionGuilds.reduce((prev, val) => prev + val, 0);
    let sessionCommands = await this.client.shard.fetchClientValues('session.commands');
    sessionCommands = sessionCommands.reduce((prev, val) => prev + val, 0);
    let sessionMessages = await this.client.shard.fetchClientValues('session.messages');
    sessionMessages = sessionMessages.reduce((prev, val) => prev + val, 0);
    let sessionPokemon = await this.client.shard.fetchClientValues('commands.pokemon');
    sessionPokemon = sessionPokemon.reduce((prev, val) => prev + val, 0);
    let uptime = await this.client.shard.fetchClientValues('uptime');
    let averageUptime = uptime.reduce((prev, val) => prev + val, 0) / this.client.shard.count;

    const embed = new this.client.embed();
    const toExec = `
top -bn2 | grep \"Cpu(s)\" | \\
sed \"s/.*, *\\([0-9.]*\\)%* id.*/\\1/\" | \\
awk '{print 100 - $1\"%\"}'
`;
    exec(toExec, {}, (err, stdout, stderr) => {
		  if (err) return msg.reply(':no_entry_sign: There was an error fetching my stats. Please try again later.');
      embed.setColor('RANDOM')
          .setAuthor(this.client.user.username + ' Statistics', this.client.user.avatarURL)
          .addField('On All Shards:', `Servers: **${guilds.toLocaleString()}** | Users: **${users.toLocaleString()}** | Channels: **${channels.toLocaleString()}** | Connections: **${voiceConnections.toLocaleString()}**`, true)
          .addField(`On Shard ${this.client.shard.id + 1}/${this.client.shard.count}:`, `Servers: **${this.client.guilds.size.toLocaleString()}** | Users: **${this.client.users.size.toLocaleString()}** | Channels: **${this.client.channels.size.toLocaleString()}** | Connections: **${this.client.voiceConnections.size.toLocaleString()}**`, true)
          .addField('Average Shard Uptime:', moment.duration(averageUptime).format(' D [days], H [hrs], m [mins], s [secs]'))
          .addField('Messages This Session:', sessionMessages.toLocaleString())
          .addField('Commands This Session:', sessionCommands.toLocaleString())
          .addField('Guilds This Session:', sessionGuilds.toLocaleString())
          .addField('Pokemon Caught This Session:', sessionPokemon.toLocaleString())
          .addField('Message Latency:', `${m.createdTimestamp - msg.createdTimestamp} MS`, true)
          .addField('Discord Latency:', `${Math.round(this.client.ping)} MS`, true)
          .addField('Memory Usage:', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
          .addField('Swap Size:', `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`, true)
          .addField('CPU Usage:', stdout.substring(5), true)
          .addField('Operating System:', `Ubuntu 16.0.4 LTS`, true)
          .addField('Creator:', 'i am toast#1213');
      m.edit({ embed });
    });
  }
}
