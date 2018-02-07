const { CommandoClient, SQLiteProvider } = require('discord.js-commando');
const fs = require('fs');
const path = require('path');
const sqlite = require('sqlite');
const { me, prefix, token } = require('./config');
const ToastyClient = require('./structures/ToastyClient');

const client = new ToastyClient({
  commandPrefix: prefix,
  unknownCommandResponse: false,
  owner: me,
  clientOptions: { disabledEvents: ['USER_NOTE_UPDATE', 'VOICE_STATE_UPDATE', 'TYPING_START', 'VOICE_SERVER_UPDATE', 'PRESENCE_UPDATE'] },
  disableEveryone: true,
  invite: 'https://discord.me/toasty'
});

client.dispatcher.addInhibitor(msg => {
	const blacklist = client.provider.get('global', 'userBlacklist', []);
	if (!blacklist.includes(msg.author.id)) return false;
	return `Has been blacklisted.`;
});

sqlite.open(path.join(__dirname, 'data', 'servers.sqlite3')).then((db) => {
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

fs.readdir(`${__dirname}/events/`, (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const eventFunction = require(`${__dirname}/events/${file}`);
    const eventName = file.split('.')[0];
    client.on(eventName, (...args) => eventFunction.run(client, ...args));
  });
});

client.login(token);
