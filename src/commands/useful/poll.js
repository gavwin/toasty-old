const { Command } = require('discord.js-commando');

const poll = {};

module.exports = class PollCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'poll',
      group: 'useful',
      memberName: 'poll',
      description: 'Creates a poll.',
      examples: ['poll Minecraft or Roblox? | Minecraft | Roblox | Other'],
      throttling: {
        usages: 1,
        duration: 60
      }
    });
  }

  run(msg) {
    let client = this.client;
    let prefix = client.options.commandPrefix;
    let nopre = msg.content.slice(prefix.length);
    let splitm = nopre.split(' ');
    let cmd = splitm[0];
    splitm = splitm.slice(1);
    let args = splitm;
    let id = msg.channel.id;
    if (poll[id]) return msg.say('**:no_entry: | There is already a poll running in this channel.**')
    if (!args[0]) return msg.say(`**To Create A Poll:**\n\`${prefix}poll <question> |<option1>|<option2>|<opt...\``);
    let split = args.join(' ').split('|');
    if (!split[0]) return msg.say(`*You must split your question and options with \`|\`\n**To Create A Poll:**\n\`${prefix}poll <question> |<option1>|<option2>|<opt...\``);
    if (!split[1]) return msg.say(`*You must have two or more options to make a poll*\n**To Create A Poll:**\n\`${prefix}poll <question> |<option1>|<option2>|<opt...\``);
    if (!split[2]) return msg.say(`*You must have two or more options to make a poll*\n**To Create A Poll:**\n\`${prefix}poll <question> |<option1>|<option2>|<opt...\``);
    poll[id] = {
      id,
      question: split[0],
      auth: msg.author.id,
      voted: {}
    };
    split.shift();
    let opt = {};
    for (let i = 0; i < split.length; i++) {
      opt[i + 1] = {
        text: split[i],
        votes: 0
      };
    }
    poll[id].opt = opt;
    let ar = [];
    let num = 1;
    Object.keys(opt).forEach(r => {
      ar.push(num + '. ' + opt[r].text) + '';
      num++
    });
    let text = '__**' + poll[id].question + '**__\n\n*You can vote with `' + prefix + 'vote <optionNum>`*\n\n**' + ar.join('\n') + '**\n\n*The creator of this poll or a server admin can end the poll early by typing `endpoll` in chat. Otherwise it will go for 2 minutes.*';
    msg.say(text, {
      split: true
    });
    let collect = msg.channel.createMessageCollector(m => {
      if (m.author.bot) return false;
      if (m.content.startsWith(prefix + 'vote') || m.content === 'endpoll') return true;
      else return false;
    }, {
      time: 180000
    });
    collect.on('collect', (m) => {
      let id = m.channel.id;
      if (m.content === 'endpoll') {
        if (poll[id].auth === m.author.id) return collect.stop('early');
        else if (m.channel.permissionsFor(m.member).has('MANAGE_CHANNELS')) return collect.stop('early');
        else return;
      } else {
        m.delete();
        if (poll[id].voted[m.author.id]) return m.reply('**You have already voted.**');
        let sp = m.content.split(' ');
        if (!sp[1]) return m.reply('**Provide the option number you are voting on**');
        let tot = Object.keys(poll[id].opt).length;
        let num = parseInt(sp[1]) || 0;
        if (num < 1 || num > tot) return m.reply(`**The option number must be between 1 and ${tot}**`);
        poll[id].voted[m.author.id] = true;
        poll[id].opt[num.toString()].votes++;
        m.reply(`:white_check_mark: you've successfully voted.`);
      }
    });
    collect.on('end', (col, reas) => {
      if (reas === 'time' && col.size < 1) {
        msg.say('**The poll has ended without any votes.**');
        delete poll[id];
      } else if (reas === 'early' && col.size < 2) {
        msg.say('**The poll has ended without any votes.**');
        delete poll[id];
      } else {
        done(col.first());
      }
    });

    function done(message) {
      let id = msg.channel.id;
      let opt = [];
      let votes = Object.keys(poll[id].opt);
      votes = votes.sort((a, b) => {
        return poll[id].opt[b].votes - poll[id].opt[a].votes;
      });
      let num = 1;
      let arr = [];
      votes.forEach(p => {
        let i = poll[id].opt[p];
        arr.push('**' + num + '. ' + i.text + ' = ' + i.votes + '**')
        num++
      });
      let text = '*Here are the results:*\n\n__**' + poll[id].question + '**__\n\n' + arr.join('\n');
      msg.say(text);
      return delete poll[id];
    }
  }
};
