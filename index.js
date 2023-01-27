require("dotenv").config();
const {
  Client,
  Events,
  GatewayIntentBits,
  hideLinkEmbed,
  bold,
  time,
  roleMention,
} = require("discord.js");
const registerCommands = require("./src/command-creator");
const { getRegisteredGuilds } = require("./src/registered-guilds");

const token = process.env.TOKEN;
if (!token) {
  throw new Error("No token found");
}

const clientId = process.env.CLIENT_ID;
if (!clientId) {
  throw new Error("No clientId found");
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, async (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
  registerCommands(client, token, clientId, "487629479083245568");
});

client.login(token);

async function getGuildEvents(guildId) {
  const guild = await client.guilds.fetch(guildId);
  return await guild.scheduledEvents.fetch();
}

async function checkAndNotifyGuildEvents(ts, guildId, registeredEventsList) {
  const events = await getGuildEvents(guildId);

  events.forEach(async (event) => {
    const eventTime = new Date(event.scheduledStartTimestamp);
    eventTime.setSeconds(0, 0);

    console.log(
      ts.toString(),
      ts.getTime(),
      eventTime.toString(),
      eventTime.getTime()
    );

    if (eventTime.getTime() !== ts.getTime()) {
      // skip when not 5 minutes before
      return;
    }

    const matchingRegisteredEvent = registeredEventsList.find(
      (r) =>
        r.eventType.toLowerCase() ===
        event.entityMetadata.location.toLowerCase()
    );

    if (matchingRegisteredEvent) {
      console.log(eventTime);
      const channel = await client.channels.fetch(
        matchingRegisteredEvent.channelId
      );
      const message = `${roleMention(matchingRegisteredEvent.roleId)}\n${bold(
        event.name
      )} starts ${time(
        new Date(event.scheduledStartTimestamp),
        "R"
      )}\n${hideLinkEmbed(event.url)}`;
      channel.send(message);
    }
  });
}

async function run() {
  const nowPlusFiveMinutes = new Date();
  nowPlusFiveMinutes.setSeconds(0, 0);
  nowPlusFiveMinutes.setMinutes(nowPlusFiveMinutes.getMinutes() + 5);

  const registeredGuilds = getRegisteredGuilds();
  Object.entries(registeredGuilds).forEach(
    ([guildId, registeredEventsList]) => {
      checkAndNotifyGuildEvents(
        nowPlusFiveMinutes,
        guildId,
        registeredEventsList
      );
    }
  );
}

setInterval(run, 60_000);
run();
