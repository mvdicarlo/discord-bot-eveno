const fs = require("node:fs");
const { join } = require("path");
const { REST, Routes, Events } = require("discord.js");

const commands = {};
const commandsJson = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs
  .readdirSync(join(__dirname, "/commands"))
  .filter((file) => file.endsWith(".js"));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  const json = command.data.toJSON();
  commandsJson.push(json);
  commands[json.name] = command.execute;
}

// Construct and prepare an instance of the REST module

async function register(client, token, clientId, guildId) {
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = commands[interaction.commandName];
    if (command) {
      await command(interaction);
    }
  });

  const rest = new REST({ version: "10" }).setToken(token);
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(Routes.applicationCommands(clientId), {
      body: commandsJson,
    });

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
}

module.exports = register;
