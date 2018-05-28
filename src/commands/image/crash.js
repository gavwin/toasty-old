const { Command } = require('discord.js-commando');

const images = [
  'https://i.stack.imgur.com/U5hlt.jpg', 'https://i.stack.imgur.com/D1xma.png',
  'http://3.bp.blogspot.com/-ISOa-ufScRA/UAcPBaTYXaI/AAAAAAAAAFc/ox0dZ18we6M/s1600/Screen+Shot+2012-07-17+at+1.15.17+AM.png',
  'http://www.itconsultants.com.au/media/1515/blue-screen-of-death.jpg', 'http://www.winhelponline.com/blog/wp-content/uploads/2016/12/gsod-crash-screen-1.png',
  'http://www.terinea.co.uk/blog/wp-content/uploads/2007/06/image47.png', 'https://i.stack.imgur.com/Tliko.jpg',
  'http://www.appleallen.net/crashnburn/files/page5_2.jpg', 'https://www.techworm.net/wp-content/uploads/2016/07/Untitled-6.png',
  'https://cdn3.techadvisor.co.uk/cmsdata/features/3624863/BSoD_in_Windows_8_thumb800.png', 'http://www.alltecheasy.com/wp-content/uploads/2015/09/Blue-Screen-of-Death-Error-1.jpg',
  'https://filestore.community.support.microsoft.com/api/images/f2823f3c-226c-4270-b2c3-ea152e9985d3'
];

module.exports = class CrashCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'crash',
      group: 'image',
      description: 'Make your computer crash.',
      memberName: 'crash'
    });
  }

  async run(msg, { user }) {
    const embed = new this.client.embed()
      .setColor('RANDOM')
      .setTitle('❌ Uh oh!')
      .setImage(this.client.randomArray(images));
    if (msg.channel.type === 'dm') return msg.embed(embed);
    if (!msg.guild.me.permissions.has('EMBED_LINKS')) return msg.reply(':no_entry_sign: [**Missing Permissions**]: I don\'t have the **Embed Links** permission!');
    msg.embed(embed);
  }
};
