const { SQLiteProvider, FriendlyError } = require('discord.js-commando');
const readdir = require('util').promisify(require('fs').readdir);
const path = require('path');
const sqlite = require('sqlite');
const { me, prefix, token } = require('./config');
const ToastyClient = require('./structures/ToastyClient');
const { oneLine, stripIndents } = require('common-tags');

const client = new ToastyClient({
  commandPrefix: prefix,
  unknownCommandResponse: false,
  owner: me,
  clientOptions: {
    disabledEvents: [
      'USER_NOTE_UPDATE',
      'VOICE_STATE_UPDATE',
      'TYPING_START',
      'VOICE_SERVER_UPDATE',
      'PRESENCE_UPDATE'
    ]
  },
  disableEveryone: true,
  invite: 'https://toastybot.com/hq'
});

client
  .on('error', err => {
    /*if (/ETIMEDOUT|getaddrinfo|Something took too long to do/.test(err)) process.exit(200);
    if (/SequelizeUniqueConstraintError/.test(err)) return;
    client.channels
      .get('434682326232989696')
      .send(stripIndents`
        \`ERROR EVENT EMITTED:\`
        \`\`\`javascript
        ${err.stack.split(client.token).join('-censored-')}
        \`\`\`
      `, { split: { char: '', prepend: '```javascript\n', append: '\n```', maxLength: 1900 } }).catch(err_ => console.error('DISCORD', err_));*/
    console.error('ERROR', err);
  })
  .on('warn', warn => {
    /*client.channels
      .get('434682326232989696')
      .send(stripIndents`
        \`WARN EVENT EMITTED:\`
        \`\`\`
        ${warn.split(client.token).join('-censored-')}
        \`\`\`
      `, { split: true }).catch(err_ => console.error('DISCORD', err_));*/
  })
  .on('ready', async () => {
    console.log(oneLine`
    Shard ${client.shard.id + 1}/${client.shard.count} ready!
    On ${client.guilds.size.toLocaleString()} guilds w/ ${client.users.size.toLocaleString()} users.`);
    const guilds = await client.shard.fetchClientValues('guilds.size');
    client.user.setActivity(`;help ;invite | ${guilds.reduce((prev, val) => prev + val, 0).toLocaleString()} servers!`);
    setInterval(() => client.user.setActivity('toastybot.com'), 2700000);
  })
  .on('reconnecting', () => {
    console.log(`Reconnecting event fired on shard ${client.shard.id + 1}.`);
    /*client.channels
      .get('434682326232989696')
      .send(`Reconnecting event fired on shard ${client.shard.id + 1} of ${client.shard}.`);*/
  })
  .on('commandRun', cmd => {
    //console.info(`COMMAND RUN: ${cmd.groupID}:${cmd.memberName}`);
    client.session.commands++;
    if (!client.commands.hasOwnProperty(cmd.memberName)) client.commands[cmd.memberName] = 1;
    else client.commands[cmd.memberName]++;
  })
  .on('commandError', (cmd, err) => {
    if (err instanceof FriendlyError) return;
    console.error(`Error in cmd ${cmd.name}:`, err);
    /*client.channels
      .get('434682326232989696')
      .send(stripIndents`
        \`COMMAND ERRORED: ${cmd.groupID}:${cmd.memberName}\`
        \`\`\`javascript
        ${err.stack.split(client.token).join('-censored-')}
        \`\`\`
      `, { split: { char: '', prepend: '```javascript\n', append: '\n```', maxLength: 1900 } }).catch(err_ => client.utils.logger.error('DISCORD', err_));*/
  })
  .on('providerReady', () => console.info('SettingsProvider ready'));
  // eslint-disable-next-line max-len
  //.on('commandBlocked', (message, reason) => console.info(`Command ${message.command.groupID}:${message.command.memberName} blocked, reason: ${reason}`));

// Load the events with huge chunks of code from the events folder
(async () => {
  try {
    const files = await readdir(`${__dirname}/events/`);
    for (const file of files) {
      if (!file.endsWith('.js')) {
        console.warn('Loading invalid event file, skipping...');
        continue;
      }
      let run;
      try {
        run = require(`${__dirname}/events/${file}`).run;
      } catch (err) {
        console.error(err);
        continue;
      }
      const [event] = file.split('.');
      client.on(event, (...args) => run(client, ...args));
      //console.info('Loaded event:', event);
    }
  } catch (err) {
    console.error(err);
  }
})();

client.dispatcher.addInhibitor(msg => {
  const blacklist = client.provider.get('global', 'userBlacklist', []);
  if (!blacklist.includes(msg.author.id)) return false;
  return 'Has been blacklisted.';
});

/*client.dispatcher.addInhibitor(msg => {
  if (!msg.command) return false;
  if (msg.command.name !== 'trade') return false;
  return [
    'Trade command',
    msg.reply('the trade command is disabled.')
  ];
});*/

client.dispatcher.addInhibitor(msg => {
  if (!msg.command) return false;
  if (!msg.guild) return false;
  if (msg.guild.id !== '208674478773895168') return false;
  if (msg.channel.id === '303206425113657344') return false;
  if (msg.command.groupID !== 'pokemon') return false;
  return [
    'pokemon outside commands',
    msg.reply('pokemon commands must be used in <#303206425113657344>!')
  ];
});

sqlite.open(path.join(__dirname, 'data', 'servers.sqlite3')).then(db => {
  client.setProvider(new SQLiteProvider(db));
});

client.registry
  .registerDefaultTypes()
  .registerGroups([
    ['util', 'Utility'],
    ['useful', 'Useful'],
    ['fun', 'Fun'],
    ['pokemon', 'Pokemon'],
    ['info', 'Information'],
    ['mod', 'Moderation'],
    ['config', 'Configuration'],
    ['music', 'Music'],
    ['misc', 'Miscellaneous'],
    ['commands', 'Commands']
  ])
  .registerDefaultGroups()
  .registerDefaultCommands({ ping: false, help: false })
  .registerCommandsIn(path.join(__dirname, 'commands'));

client.login(token).catch(console.error);

/*process.on('unhandledRejection', (err, promise) => {
  if (/ETIMEDOUT|getaddrinfo|Something took too long to do/.test(err)) process.exit(200);
  if (/SequelizeUniqueConstraintError/.test(err)) return;
  client.channels
    .get('434682326232989696')
    .send(stripIndents`
      \`UNHANDLED PROMISE REJECTION:\`
      \`\`\`javascript
      ${require('util').inspect(promise, { depth: 2 }).split(client.token).join('-censored-')}
      \`\`\`
    `, { split: { char: '', prepend: '```javascript\n', append: '\n```', maxLength: 1900 } }).catch(err_ => client.utils.logger.error('DISCORD', err_));
  console.error('ERROR', 'Unhandled promise rejection at', promise, err);
});*/
