const { indicoToken, youTubeToken, prefix, me, discordbotsToken } = require('../config.json');
const indico = require('indico.io');
const snekfetch = require('snekfetch');
const path = require('path');
const fs = require('fs');
const url = require('url');
const statsPath = path.join(__dirname, '..', 'data', 'stats.json');
const yt = require('ytdl-core');
const YouTube = require('youtube-node');
const youTube = new YouTube();
youTube.setKey(youTubeToken);
const DYouTube = require('discord-youtube-api');
const dyouTube = new DYouTube(youTubeToken);
const playlists = ['pop', 'hiphop', 'electro', 'classical', 'rock-n-roll', 'chill', 'jazz', 'metal', 'retro', 'korean', 'toast'];

exports.run = (client, msg) => {
  const RichEmbed = client.embed;
  client.session.messages++;
  if (msg.channel.type === 'dm') return;

  if (msg.content.startsWith(prefix+'ctlogs') && msg.author.id === me) {
    msg.reply(':white_check_mark: Logged and cleared ctLogger.');
    console.log(ctLogger.join('\n'));
    ctLogger.splice(0, ctLogger.length);
  }

   const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'servers.json'), 'utf8')); const settings = data[msg.guild.id] ? data[msg.guild.id] : {nonsfw: 'disabled', noinvite: 'disabled', nomemedog: 'disabled'};

  if (settings.nonsfw === 'enabled' && msg.attachments) {
    const urls = msg.attachments
      .map(a => a.url)
      .concat(msg.content.split(' ')
          .map(x => url.parse(x))
          .filter(x => x.hostname)
          .map(x => url.format(x)));
      for (const URL of urls) {
        indico.contentFiltering(URL, { apiKey: indicoToken })
          .then((res) => {
            if (typeof res !== 'number' || res < (0.93)) return;
            if (!msg.guild.member(client.user).permissions.has('MANAGE_MESSAGES')) return msg.channel.send(':no_entry_sign: **Error:** I could not delete NSFW content because I do not have the **Manage Messages** permission!');
            msg.delete().then(() => msg.reply(':no_entry_sign: There is no NSFW content allowed on this server!'));
            if (settings.modlog === 'enabled') {
              const embed = new RichEmbed();
        			const today = new Date();
        			const date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
        			const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        			const channel = msg.guild.channels.find('name', 'mod-log').id;
        			embed.setColor(0xADD8E6)
        				   .setAuthor(msg.author.username, msg.author.avatarURL)
        					 .setTitle('NSFW Content Deleted:')
        					 .setDescription(`${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`)
        					 .setFooter(`${date} at ${time}`);
        			client.channels.get(channel).send({ embed }).catch(err => {
        				return msg.reply(':no_entry_sign: **Error:** I couldn\'t send an embed in the #mod-log. Please make sure I have access to a channel called mod-log!');
        			});
            }
          }).catch(() => {});
      }
  }

  const invites = ['https://discord.gg/', 'http://discord.gg/', 'discord.gg/', 'https://discordapp.com/invite/', 'http://discordapp.com/invite/', 'discordapp.com/invite/'];
  if (invites.some(m => msg.content.toLowerCase().includes(m))) {
    if (settings.noinvite === 'enabled') {
      if (msg.author.id === msg.guild.ownerID) return;
      if (!msg.guild.member(client.user).permissions.has('MANAGE_MESSAGES')) return msg.channel.send(':no_entry_sign: **Error:** I could not delete a Discord invite because I do not have the **Manage Messages** permission!');
      msg.delete().then(() => msg.reply(':no_entry_sign: There is no invite link sending allowed on this server!'));
      if (settings.modlog === 'enabled') {
        const embed = new RichEmbed();
  			const today = new Date();
  			const date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
  			const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  			const channel = msg.guild.channels.find('name', 'mod-log').id;
  			embed.setColor(0xADD8E6)
  				   .setAuthor(msg.author.username, msg.author.avatarURL)
  					 .setTitle('Invite Deleted:')
  					 .setDescription(`${msg.author.username}#${msg.author.discriminator} (${msg.author.id})`)
  					 .setFooter(`${date} at ${time}`);
  			client.channels.get(channel).send({ embed }).catch(err => {
  				return msg.reply(':no_entry_sign: **Error:** I couldn\'t send an embed in the #mod-log. Please make sure I have access to a channel called mod-log!');
  			});
      }
    }
  }

  if (msg.content.includes('This is memedog.') && msg.content.includes('Help memedog take over Discord by pasting in 10 other servers or he will never be a meme dog') && settings.nomemedog === 'enabled') {
    if (!msg.guild.member(client.user).permissions.has('MANAGE_MESSAGES')) return msg.channel.send(':no_entry_sign: **Error:** I could not delete memedog because I do not have the **Manage Messages** permission!');
    msg.delete().then(() => msg.reply(':no_entry_sign: There is no memedog allowed on this server!'));
  }

  if (!msg.content.startsWith(prefix)) return;
  client.session.commands++;
  //if (msg.content.startsWith(prefix + 'play') && !msg.guild.member(client.user).permissions.has('CONNECT') || !msg.guild.member(client.user).permissions.has('SPEAK')) return msg.reply(':no_entry_sign: I don\'t have the **Connect** or **Speak** permission!');
  if (musicCommands.hasOwnProperty(msg.content.toLowerCase().slice(1).split(' ')[0])) musicCommands[msg.content.toLowerCase().slice(1).split(' ')[0]](msg);
}

const queue = new Object();
const musicCommands = {
  'play': (msg) => {
    if (queue[msg.guild.id] === undefined) return msg.channel.send(`:no_entry_sign: There are currently no songs in the server queue.\nAdd some with \`${prefix}add [song name | YouTube video URL]\``);
    if (!msg.guild.voiceConnection) return musicCommands.join(msg).then(() => musicCommands.play(msg));
    if (queue[msg.guild.id].paused) return msg.channel.send(`:no_entry_sign: I\'m currently paused. Type \`${prefix}resume\` to resume playing the current song.`);
    if (queue[msg.guild.id].playing) return msg.channel.send(':no_entry_sign: I\'m already playing music on this server!');
    let dispatcher;
    if (!queue[msg.guild.id]) queue[msg.guild.id] = { playing: true };
    queue[msg.guild.id].playing = true;

    (function play(song) {
      if (!queue[msg.guild.id]) queue[msg.guild.id] = { songs: [] };
      if (queue[msg.guild.id].songs === undefined) return msg.channel.send(':no_entry_sign: The server queue is now empty. Leaving voice channel...').then(() => {
        if (!queue[msg.guild.id]) queue[msg.guild.id] = { playing: false };
        queue[msg.guild.id].playing = false;
        msg.member.voiceChannel.leave();
      });
      if (song === undefined) return msg.channel.send(':no_entry_sign: The server queue is now empty. Leaving voice channel...').then(() => {
        if (!queue[msg.guild.id]) queue[msg.guild.id] = { playing: false };
        queue[msg.guild.id].playing = false;
        msg.member.voiceChannel.leave();
      });
      msg.channel.send(`:satellite: Loading **${song.title}**...`).then(m => {
        try {
          setTimeout(() => {
            m.edit(`:notes: Now playing **${song.title}** as requested by **${song.requester}**`);
          }, 1000);
        } catch(e) {
          m.edit(`:notes: Now playing **${song.title}** as requested by **${song.requester}**`);
        }
      });
      try {
        dispatcher = msg.guild.voiceConnection.playStream(yt(song.url, { audioonly: true, passes: 2 }));
      } catch(e) {
        msg.channel.send('There was an issue playing the next song in the queue.');
      }
      let collector = msg.channel.createCollector(m => m);
      collector.on('collect', m => {
        if (m.content.startsWith(prefix+'pause')) {
          msg.channel.send(':pause_button: Paused.').then(() => {
            dispatcher.pause();
            queue[msg.guild.id].paused = true;
          });
        } else if (m.content.startsWith(prefix+'resume')) {
          msg.channel.send(':play_pause: Resumed.').then(() => {
            dispatcher.resume();
            queue[msg.guild.id].paused = false;
          });
        } else if (m.content.startsWith(prefix+'skip')) {
          const mData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'servers.json')));
          const mSettings = mData[msg.guild.id] ? mData[msg.guild.id] : {DJRole: 'disabled'};
          if (mSettings.DJRole === 'disabled') {
            msg.channel.send(':arrow_forward: Skipped.').then(() => {
              dispatcher.end();
            });
          } else {
            if (mSettings.DJRole === undefined) {
              msg.channel.send(':arrow_forward: Skipped.').then(() => {
                dispatcher.end();
              });
            } else {
              const DJRole = msg.guild.roles.find('name', mSettings.DJRole);
              if (!DJRole) return msg.channel.send(`:no_entry_sign: **Error:** The currently set DJ role is not a role on this server. Please either set the DJ role to \`off\` or to a valid role on this server.\nYou may do this by using: \`${prefix}djrole [role | off]\``);
              if (!msg.member.roles.has(DJRole.id)) return msg.channel.send(`:no_entry_sign: You can't use the skip commands because you do not have the **${DJRole}** DJ role.`);
              msg.channel.send(':arrow_forward: Skipped.').then(() => {
                dispatcher.end();
              });
            }
          }
        } else if (m.content.startsWith(prefix+'volume')) {
          /*const donators = require('../data/donatorids');
          const staff = require('../data/staffids');
          if (donators.includes(msg.author.id) || staff.includes(msg.author.id)) {*/
            if (m.content === prefix+'volume')  {
              try {
                let vol = dispatcher.volume * 100;
                if (vol >= 125) return msg.channel.send(`:loud_sound: The volume is **${vol}**.`);
                if (vol >= 75 && vol <= 124) return msg.channel.send(`:sound: The volume is **${vol}**.`);
                if (vol <= 74) return msg.channel.send(`:speaker: The volume is **${vol}**.`);
              } catch(e) {
                let vol = 100;
                if (vol >= 125) return msg.channel.send(`:loud_sound: The volume is **${vol}**.`);
                if (vol >= 75 && vol <= 124) return msg.channel.send(`:sound: The volume is **${vol}**.`);
                if (vol <= 74) return msg.channel.send(`:speaker: The volume is **${vol}**.`);
              }
            }
            let vol = parseInt(m.content.replace(prefix+'volume ', ''));
            if (vol > 200 || vol < 0) return msg.channel.send(':no_entry_sign: You can only set the volume from `0-200`!');
            if (vol >= 125) msg.channel.send(`:loud_sound: Set the volume to **${vol}**.\n(The higher the volume is, the lower the quality so you might want to consider raising the voice channel volume or your speaker volume)`);
            if (vol >= 75 && vol <= 124) msg.channel.send(`:sound: Set the volume to **${vol}**.`);
            if (vol <= 74) msg.channel.send(`:speaker: Set the volume to **${vol}**.`);
            try { dispatcher.setVolume((vol / 100)) } catch (e) {}
            if (!queue[msg.guild.id]) queue[msg.guild.id] = { volume: vol / 100 };
            queue[msg.guild.id].volume = vol / 100;
          /*} else {
            msg.channel.send(':no_entry_sign: This is a donator only command, you can donate here: http://toastybot.com/donate');
          }*/
        } else if (m.content.startsWith(prefix+'time')) {
          msg.channel.send(`:clock1: Time: ${Math.floor(dispatcher.time / 60000)}:${Math.floor((dispatcher.time % 60000)/1000) <10 ? '0'+Math.floor((dispatcher.time % 60000)/1000) : Math.floor((dispatcher.time % 60000)/1000)}`);
        } else if (m.content.startsWith(prefix+'stop')) {
          const mData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'servers.json')));
          const mSettings = mData[msg.guild.id] ? mData[msg.guild.id] : {DJRole: 'disabled'};
          const voiceChannel = msg.member.voiceChannel;
          if (!voiceChannel || voiceChannel.type !== 'voice') return m.reply(':no_entry_sign: You\'re not in a voice channel!');
          if (mSettings.DJRole === 'disabled') {
            stopPlaying(msg, collector);
          } else {
            if (mSettings.DJRole === undefined) {
              stopPlaying(msg, collector);
            } else {
              const DJRole = msg.guild.roles.find('name', mSettings.DJRole);
              if (!DJRole) return msg.channel.send(`:no_entry_sign: **Error:** ${DJRole} is not a role on this server. Please either set the DJ role to \`off\` or to a valid role on this server.\nYou may do this by using: \`${prefix}djrole [role | off]\``);
              if (!msg.member.roles.has(DJRole.id)) return msg.channel.send(`:no_entry_sign: You can't use the stop commands because you do not have the **${DJRole}** DJ role.`);
              stopPlaying(msg, collector);
            }
          }
        }
      });
      dispatcher.once('end', () => {
        collector.stop();
        if (!queue[msg.guild.id]) queue[msg.guild.id] = { songs: [] };
        if (queue[msg.guild.id].songs.length === undefined || queue[msg.guild.id].songs.length === 0) {
          delete queue[msg.guild.id];
          delete dispatcher;
          msg.channel.send('There are no more songs in the queue. Leaving voice channel...');
          const voiceChannel = msg.member.voiceChannel;
          if (!voiceChannel || voiceChannel.type !== 'voice') return msg.channel.send(`I could not leave the voice channel. Try using, \`${prefix}leave\`.`);
          voiceChannel.leave();
        } else {
          setTimeout(() => {
            delete dispatcher;
            play(queue[msg.guild.id].songs.shift());
          }, 200);
          setTimeout(() => {
            if (!queue[msg.guild.id]) queue[msg.guild.id] = {volume: 1};
            if (queue[msg.guild.id].volume) dispatcher.setVolume(queue[msg.guild.id].volume);
          }, 1000);
        }
      });
      dispatcher.on('error', (err) => {
        return msg.channel.send(':no_entry_sign: **Error:** An unknown error occured:\n'+err).then(() => {
          collector.stop();
          play(queue[msg.guild.id].songs.shift());
          setTimeout(() => {
            if (!queue[msg.guild.id]) queue[msg.guild.id] = {volume: 1};
            if (queue[msg.guild.id].volume) dispatcher.setVolume(queue[msg.guild.id].volume);
          }, 1000);
        });
      });
    })(queue[msg.guild.id].songs.shift());
  },
  'join': (msg) => {
    return new Promise((resolve, reject) => {
      const voiceChannel = msg.member.voiceChannel;
      if (!voiceChannel || voiceChannel.type !== 'voice') return msg.reply(':no_entry_sign: Please be in a voice channel when using this command.');
      voiceChannel.join().then(connection => {
        resolve(connection);
        msg.channel.send(':white_check_mark: I\'ve joined your voice channel.');
      }).catch(err => {
        reject(err);
        msg.reply(':no_entry_sign: I couldn\'t connect to your voice channel.');
      });
    });
  },
  'leave': (msg) => {
    const voiceChannel = msg.member.voiceChannel;
    if (!voiceChannel || voiceChannel.type !== 'voice') return msg.reply(':no_entry_sign: Please be in a voice channel when using this command.');
    voiceChannel.leave();
    msg.channel.send('I\'ve left your voice channel.');
    try {
      if (queue[msg.guild.id].playing === true) queue[msg.guild.id].playing = false;
    } catch(e) {}
  },
  'add': (msg) => {
    async function addFromUrl(url) {
      const m = await msg.channel.send('*Adding...*');
      if (url == '' || url === undefined) return m.edit(`:no_entry_sign: You must add a YouTube video URL after \`${prefix}add\``);
      yt.getInfo(url, (err, info) => {
        if (err) return m.edit(':no_entry_sign: There was an issue getting that song. Please try a different one.');
        if (!queue.hasOwnProperty(msg.guild.id)) queue[msg.guild.id] = {}, queue[msg.guild.id].playing = false, queue[msg.guild.id].songs = [];
        try {
          queue[msg.guild.id].songs.push({
            url: url,
            title: info.title,
            requester: msg.author.username
          });
          m.edit(`:white_check_mark: Added **${info.title}** to the queue.`);
        } catch (err) {
          queue[msg.guild.id] = {
            songs: [
              {
                url: url,
                title: info.title,
                requester: msg.author.username
              }
            ]
          };
          m.edit(`:white_check_mark: Added **${info.title}** to the queue.`);
        }
      });
    }

    function addFromQuery(query) {
      youTube.search(query, 2, (err, result) => {
        if (err) return msg.channel.send(':no_entry_sign: **Error:** There was an issue getting that song. Please try a different one.');
        try {
          let url = `https://www.youtube.com/watch?v=${result.items[0]['id'].videoId}`;
          addFromUrl(url);
        } catch(e) {
          msg.channel.send(':no_entry_sign: **Error:** There was an issue getting that song. Please try a different one.');
        }
      });
    }

    async function addFromPlaylist(url) {
      if (url == '' || url === undefined) return m.edit(`:no_entry_sign: You must add a YouTube video URL after \`${prefix}add\``);
      const m = await msg.channel.send('*Adding...*');
      const songs = await dyouTube.getPlaylist(url);
      for (let i = 0, len = songs.length; i < len; i++) {
        try {
          if (!queue.hasOwnProperty(msg.guild.id)) queue[msg.guild.id] = {}, queue[msg.guild.id].playing = false, queue[msg.guild.id].songs = [];
          queue[msg.guild.id].songs.push({
            url: songs[i].url,
            title: songs[i].title,
            requester: msg.author.username
          });
        } catch(e) {}
      }
      m.edit(`:white_check_mark: The playlist has been queued.`);
    }

    if (msg.content === prefix+'add') return;
    let url = msg.content.split(' ')[1];
    const ytUrls = ['https://youtube.com/', 'http://youtube.com/', 'https://youtu.be/', 'http://youtu.be/', 'https://www.youtube.com/', 'http://www.youtube.com/', 'https://www.youtu.be/', 'http://youtu.be/'];
    if (ytUrls.some(r => msg.content.includes(r)) && msg.content.includes('playlist')) {
      addFromPlaylist(url);
    } else
    if (ytUrls.some(r => msg.content.includes(r))) {
      addFromUrl(url);
    } else {
      let query = msg.content.replace(prefix+'add', '');
      addFromQuery(query);
    }
  },
  'queue': (msg) => {
    if (queue[msg.guild.id] === undefined) return msg.channel.send(`:no_entry_sign: There are currently no songs in the server queue.\nAdd some with \`${prefix}add [song name / URL]\``);
    let tosend = new Array();
    try {
      queue[msg.guild.id].songs.forEach((song, i) => {
        tosend.push(`${i+1}. ${song.title} - Requested by: ${song.requester}`);
      });
      msg.channel.send(`__**${msg.guild.name}'s Music Queue:**__ Currently **${tosend.length}** songs queued ${(tosend.length > 15 ? '*[Only next 15 shown]*' : '')}\n\`\`\`${tosend.slice(0,15).join('\n')}\`\`\``);
    } catch(e) {
      if (!queue[msg.guild.id]) queue[msg.guild.id] = { songs: [] };
      msg.channel.send(`:no_entry_sign: There was an error getting the queue:\n${e}`);
    }
  },
  'clearqueue': (msg) => {
    const mData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'servers.json')));
    const mSettings = mData[msg.guild.id] ? mData[msg.guild.id] : {DJRole: 'disabled'};
    if (mSettings.DJRole === 'disabled') {
      clearqueue(msg);
    } else {
      if (mSettings.DJRole === undefined) {
        clearqueue(msg);
      } else {
        const DJRole = msg.guild.roles.find('name', mSettings.DJRole);
        if (!DJRole) return msg.channel.send(`:no_entry_sign: **Error:** ${DJRole} is not a role on this server. Please either set the DJ role to \`off\` or to a valid role on this server.\nYou may do this by using: \`${prefix}djrole [role | off]\``);
        if (!msg.member.roles.has(DJRole.id)) return msg.channel.send(`:no_entry_sign: You can't use the clearqueue commands because you do not have the **${DJRole}** DJ role.`);
        clearqueue(msg);
      }
    }
  },
  /*'shuffle': (msg) => {
    if (queue[msg.guild.id] === undefined || !queue[msg.guild.id]) return msg.channel.send(':no_entry_sign: There are currently no songs in the server queue.');
    msg.channel.send('*Shuffling...*').then(m => {
      queue[msg.guild.id].songs.splice(0, queue[msg.guild.id].songs.length);
      setTimeout(() => {
        m.edit(':white_check_mark: The queue has been shuffled.');
        const arr = new Array();
        for (let i = 0, len = queue[msg.guild.id].songs.length; i < len; i++) {
          let r = Math.floor(Math.random() * (len + 1));
          while (arr.includes(r)) {
            r = Math.floor(Math.random() * (len + 1));
          }
          arr.push(r);
          if (!queue.hasOwnProperty(msg.guild.id)) queue[msg.guild.id] = {}, queue[msg.guild.id].playing = false, queue[msg.guild.id].songs = [];
            queue[msg.guild.id].songs.push({
              url: queue[msg.guild.id].songs[r].url,
              title: queue[msg.guild.id].songs[r].title,
              requester: queue[msg.guild.id].songs[r].requester
            });
          }
        }, 2000);
      });
  },*/
  'playlists': (msg) => {
    msg.channel.send('Avaliable playlists include:\n`'+playlists.join(', ')+'`');
  },
  'playlist': (msg) => {
    if (msg.content.toLowerCase().startsWith(prefix + 'playlist anoun')) {
      async function addFromPlaylist(url) {
        if (url == '' || url === undefined) return m.edit(`:no_entry_sign: You must add a YouTube video URL after \`${prefix}add\``);
        const m = await msg.channel.send('*Adding...*');
        const songs = await dyouTube.getPlaylist(url);
        for (let i = 0, len = songs.length; i < len; i++) {
          try {
            if (!queue.hasOwnProperty(msg.guild.id)) queue[msg.guild.id] = {}, queue[msg.guild.id].playing = false, queue[msg.guild.id].songs = [];
            queue[msg.guild.id].songs.push({
              url: songs[i].url,
              title: songs[i].title,
              requester: msg.author.username
            });
          } catch(e) {}
        }
        m.edit(`:white_check_mark: The playlist has been queued.`);
      }

      addFromPlaylist('https://www.youtube.com/playlist?list=PLNMeTJNSk-wr5cIXUGoQ2evWOrPCz9D0t');
    }
    if (msg.content === prefix+'playlist') return msg.reply(`Please specify a playlist to play!\nPlaylists: \`${playlists.join(', ')}\``);
    let playlist = msg.content.replace(prefix+'playlist ', '').toLowerCase();
    if (!playlists.includes(playlist)) return msg.reply(`That isnt an avaliable playlist.\nPlaylists: \`${playlists.join(', ')}\``);
    function cap(text) { return text.charAt(0).toUpperCase() + text.slice(1) }

    const getInfo = require('util').promisify(yt.getInfo);

    async function doPlaylist(playlist, msg) {
      const m = await msg.channel.send(`Downloading the **${playlist}** playlist...`);
      setTimeout(() => { m.edit(`Downloading the **${playlist}** playlist...\nPlease be patient, this may take up to a minute.\nYou can run the \`play\` command while the playlist is downloading to start listening to music.`); }, 3000);
      const songs = fs.readFileSync(path.join(__dirname, '..', '..', 'src', 'data', `playlists/${playlist}.txt`)).toString().split('\n');

      const arr = new Array();
      for (let i = 0, len = songs.length; i < 15; i++) {
        let r = Math.floor(Math.random() * (len + 1));
        while (arr.includes(r)) {
          r = Math.floor(Math.random() * (len + 1));
        }
        arr.push(r);
          try {
            const info = await getInfo(songs[r]);
            if (!queue.hasOwnProperty(msg.guild.id)) queue[msg.guild.id] = {}, queue[msg.guild.id].playing = false, queue[msg.guild.id].songs = [];
            queue[msg.guild.id].songs.push({
              url: songs[r],
              title: info.title,
              requester: `${cap(playlist)} Auto Playlist`
            });
          } catch(e) {}
      }
      m.edit(`:white_check_mark: The **${cap(playlist)}** playlist has been queued!\n15 songs have been queued from the playlist. To queue another 15 run the \`playlist\` command again.`);
    }

    doPlaylist(playlist, msg);
  }
};

function clearqueue(msg) {
  if (queue[msg.guild.id] === undefined || !queue[msg.guild.id]) return msg.channel.send(':no_entry_sign: There are currently no songs in the server queue.');
  try {
    queue[msg.guild.id].songs.splice(0, queue[msg.guild.id].songs.length);
    msg.reply(':white_check_mark: I\'ve cleared the server queue.');
  } catch(e) {
    msg.reply(`:no_entry_sign: **Error:**\n${e}`);
  }
}

function stopPlaying(msg, collector) {
  if (!queue[msg.guild.id]) queue[msg.guild.id] = {playing: false, paused: false};
  queue[msg.guild.id].playing = false;
  if (queue[msg.guild.id].paused) queue[msg.guild.id].paused = false;
  collector.stop();
  if (!queue[msg.guild.id]) queue[msg.guild.id] = { songs: [] };
  delete queue[msg.guild.id];
  delete dispatcher;
  const voiceChannel = msg.member.voiceChannel;
  if (!voiceChannel || voiceChannel.type !== 'voice') return msg.channel.send(`I could not leave the voice channel. Try using, \`${prefix}leave\`.`);
  voiceChannel.leave();
  msg.channel.send('I\'ve stopped playing, left your voice channel and cleared the queue.');
}

const ctLogger = new Array();
process.on('unhandledRejection', err =>  {
  try {
    if (err.name.includes('Could not extract html5player key:')) return ctLogger.push(err.stack);
  } catch (e) {

  };
  ctLogger.push(err.stack);
});
process.on('uncaughtException', err => {
  try {
    if (err.name.includes('Could not extract html5player key:')) return ctLogger.push(err.stack);
  } catch (e) {

  };
  console.error(err);
});
