const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
} = require("discord.js");
const { addRegisteredGuild } = require("./../registered-guilds");

module.exports = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setName("register")
    .setDescription("Registers an event type.")
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role that will be notified.")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel that the notification will happen in.")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("event-type")
        .setDescription("The event type that will be added.")
        .setRequired(true)
    ),
  async execute(interaction) {
    // interaction.user is the object representing the User who ran the command
    // interaction.member is the GuildMember object, which represents the user in the specific guild
    addRegisteredGuild(
      interaction.member.guild.id,
      interaction.options.getChannel("channel").id,
      interaction.options.getRole("role").id,
      interaction.options.getString("event-type"),
      interaction.user.username
    );
    await interaction.reply({ content: "Event registered", ephemeral: true });
  },
};
