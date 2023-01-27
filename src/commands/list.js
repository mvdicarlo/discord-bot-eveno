const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  channelMention,
  roleMention,
} = require("discord.js");
const { getRegisteredGuilds } = require("./../registered-guilds");

module.exports = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setName("list")
    .setDescription("List events."),
  async execute(interaction) {
    // interaction.user is the object representing the User who ran the command
    // interaction.member is the GuildMember object, which represents the user in the specific guild
    const db = getRegisteredGuilds()[interaction.guildId];
    const msg = db
      .map(
        ({ eventType, username, channelId, roleId }) =>
          `${channelMention(channelId)} - ${roleMention(
            roleId
          )} - ${eventType} : Registered by ${username}`
      )
      .join("\n");
    await interaction.reply({ content: msg, ephemeral: true });
  },
};
