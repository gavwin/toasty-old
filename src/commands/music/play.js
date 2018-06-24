const { Command } = require('discord.js-commando');
const { stripIndents } = require('common-tags');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');

const { tokens } = require('../../config');
const Song = require('../../structures/Song');

module.exports = class PlaySongCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'play',
      group: 'music',
      memberName: 'play',
      description: 'Adds a song to the queue.',
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 3
      },
      args: [
        {
          key: 'url',
          prompt: 'what music would you like to listen to?\n',
          type: 'string'
        }
      ]
    });

    this.queue = new Map();
    this.youtube = new YouTube(tokens.youtube);
  }

  async run(msg, args) {
    const url = args.url.replace(/<(.+)>/g, '$1');
    const queue = this.queue.get(msg.guild.id);

    let voiceChannel;
    if (!queue) {
      voiceChannel = msg.member.voiceChannel; // eslint-disable-line
      if (!voiceChannel) {
        return msg.reply('you aren\'t in a voice channel, please join one first!');
      }

      const permissions = voiceChannel.permissionsFor(msg.client.user);
      if (!permissions.has('CONNECT')) {
        return msg.reply('I don\'t have permission to join your voice channel.');
      }
      if (!permissions.has('SPEAK')) {
        return msg.reply('I don\'t have permission to speak in your voice channel.');
      }
    } else if (!queue.voiceChannel.members.has(msg.author.id)) {
      return msg.reply('you\'re not in the voice channel');
    }

    const statusMsg = await msg.reply('obtaining video details...');
    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com|www.youtu.be|youtu.be)\/playlist(.*)$/)) {
      const playlist = await this.youtube.getPlaylist(url);

      return this.handlePlaylist(playlist, queue, voiceChannel, msg, statusMsg);
    } else {
      try {
        const video = await this.youtube.getVideo(url);

        return this.handleVideo(video, queue, voiceChannel, msg, statusMsg);
      } catch (error) {
        try {
          const videos = await this.youtube.searchVideos(url, 1)
            .catch(() => statusMsg.edit(`${msg.author}, there were no search results.`));
          const video2 = await this.youtube.getVideoByID(videos[0].id);

          return this.handleVideo(video2, queue, voiceChannel, msg, statusMsg);
        } catch (err) {
          //console.error('YOUTUBE API', err);
          return statusMsg.edit(`${msg.author}, couldn't obtain the search result video's details.`);
        }
      }
    }
  }

  async handleVideo(video, queue, voiceChannel, msg, statusMsg) {
    if (video.durationSeconds === 0) {
      statusMsg.edit(`${msg.author}, you can't play live streams.`);

      return null;
    }

    if (!queue) {
      queue = {
        textChannel: msg.channel,
        voiceChannel,
        connection: null,
        songs: [],
        volume: 5
      };
      this.queue.set(msg.guild.id, queue);

      const result = await this.addSong(msg, video);

      if (!result.startsWith('👍')) {
        this.queue.delete(msg.guild.id);
        statusMsg.edit(result);

        return null;
      }

      statusMsg.edit(`${msg.author}, joining your voice channel...`);
      try {
        const connection = await queue.voiceChannel.join();
        queue.connection = connection;
        this.play(msg.guild, queue.songs[0]);
        statusMsg.delete();

        return null;
      } catch (error) {
        //console.error('DISCORD', 'Error occurred when joining voice channel.', error);
        this.queue.delete(msg.guild.id);
        statusMsg.edit(`${msg.author}, unable to join your voice channel.`);

        return null;
      }
    } else {
      const result = await this.addSong(msg, video);
      statusMsg.edit(result);

      return null;
    }
  }

  async handlePlaylist(playlist, queue, voiceChannel, msg, statusMsg) {
    const videos = await playlist.getVideos();
    for (const video of Object.values(videos)) {
      let video2;
      try {
        video2 = await this.youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
      } catch (err) {
        //console.error(err);
        continue;
      }
      if (video2.durationSeconds === 0) {
        statusMsg.edit(`${msg.author}, you can't play live streams.`);

        return null;
      }

      if (!queue) {
        queue = {
          textChannel: msg.channel,
          voiceChannel,
          connection: null,
          songs: [],
          volume: 5
        };
        this.queue.set(msg.guild.id, queue);

        const result = await this.addSong(msg, video2); // eslint-disable-line no-await-in-loop
        if (!result.startsWith('👍')) this.queue.delete(msg.guild.id);

        statusMsg.edit(`${msg.author}, joining your voice channel...`);
        try {
          const connection = await queue.voiceChannel.join(); // eslint-disable-line no-await-in-loop
          queue.connection = connection;
          this.play(msg.guild, queue.songs[0]);
          if ([...Object.values(videos)].indexOf(video) === [...Object.values(videos)].length - 1) statusMsg.delete();
        } catch (error) {
          //console.error('DISCORD', 'Error occurred when joining voice channel.', error);
          this.queue.delete(msg.guild.id);
          statusMsg.edit(`${msg.author}, unable to join your voice channel.`);
        }
      } else {
        await this.addSong(msg, video2); // eslint-disable-line no-await-in-loop
        if ([...Object.values(videos)].indexOf(video) === [...Object.values(videos)].length - 1) statusMsg.delete();
      }
    }

    queue.textChannel.send(stripIndents`
      Playlist: ${playlist.title} has been added to the queue.
    `);

    return null;
  }

  addSong(msg, video) {
    const queue = this.queue.get(msg.guild.id);

    //console.info('DISCORD', 'Adding song to queue.', { song: video.id, guild: msg.guild.id });
    const song = new Song(video, msg.member);
    queue.songs.push(song);

    return `👍 Added **${song}** to the queue.`;
  }

  play(guild, song) {
    const queue = this.queue.get(guild.id);

    const vote = this.votes.get(guild.id);
    if (vote) {
      clearTimeout(vote);
      this.votes.delete(guild.id);
    }

    if (!song) {
      try {
        queue.textChannel.send('The queue is empty! Stopping playback...');
        queue.voiceChannel.leave();
        this.queue.delete(guild.id);
        return;
      } catch (err) {
        this.queue.delete(guild.id);
        return;
      }
    }

    const playing = queue.textChannel.send(stripIndents`
      Now playing: **${song}**
    `);
    let streamErrored = false;
    const stream = ytdl(song.url, { quality: 'highestaudio' })
      .on('error', err => {
        streamErrored = true;
        //console.error('YTDL', 'Error occurred when streaming video:', err);
        playing.then(msg => msg.edit(`👎 Couldn't play ${song}.`));
        queue.songs.shift();
        this.play(guild, queue.songs[0]);
      });
    const dispatcher = queue.connection.play(stream, { passes: 5 })
      .on('end', () => {
        if (streamErrored) return;
        queue.songs.shift();
        this.play(guild, queue.songs[0]);
      })
      .on('error', err => {
        //console.error('DISCORD', 'Error occurred in stream dispatcher:', err);
        queue.textChannel.send(`An error occurred while playing the song: \`${err}\``);
      });
    dispatcher.setPLP(0.01);
    dispatcher.setVolumeLogarithmic(queue.volume / 5);
    song.dispatcher = dispatcher;
    song.playing = true;
  }

  get votes() {
    if (!this._votes) this._votes = this.client.registry.resolveCommand('music:skip').votes;

    return this._votes;
  }
};
