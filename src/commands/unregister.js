const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { removeRegisteredGuild } = require("./../registered-guilds");

module.exports = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setName("unregister")
    .setDescription("Removes an event type.")
    .addStringOption((option) =>
      option
        .setName("event-type")
        .setDescription("The event type that will be removed.")
        .setRequired(true)
    ),
  async execute(interaction) {
    // interaction.user is the object representing the User who ran the command
    // interaction.member is the GuildMember object, which represents the user in the specific guild
    removeRegisteredGuild(
      interaction.member.guild.id,
      interaction.options.getString("event-type")
    );
    await interaction.reply({ content: "Event type removed", ephemeral: true });
  },
};
