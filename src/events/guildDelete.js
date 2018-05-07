exports.run = async (client, guild) => {
  await client.database.removeEntry(guild.id);
  client.session.guilds--;
};
