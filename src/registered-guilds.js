const { writeFile } = require("fs/promises");
const { readFileSync } = require("fs");
const { join } = require("path");

const path = join("db.json");

const registeredGuilds = readDB();

function getRegisteredGuilds() {
  return JSON.parse(JSON.stringify(registeredGuilds));
}

function addRegisteredGuild(guildId, channelId, roleId, eventType, username) {
  if (!registeredGuilds[guildId]) {
    registeredGuilds[guildId] = [];
  }

  const isDuplicate = registeredGuilds[guildId].some(
    (record) =>
      record.channelId === channelId &&
      record.roleId === roleId &&
      record.eventType === eventType
  );

  if (!isDuplicate) {
    registeredGuilds[guildId].push({
      channelId,
      roleId,
      eventType,
      username,
    });
  }

  save();
}

function removeRegisteredGuild(guildId, eventType) {
  if (registeredGuilds[guildId]) {
    const index = registeredGuilds[guildId].findIndex(
      (record) => record.eventType === eventType
    );
    if (index >= 0) {
      registeredGuilds[guildId].splice(index, 1);
    }
  }

  save();
}

function save() {
  writeFile(path, JSON.stringify(registeredGuilds, null, 1));
}

function readDB() {
  let db = {};
  try {
    db = JSON.parse(readFileSync(path).toString());
  } catch (err) {
    console.error(err);
  }

  return db;
}

module.exports = {
  getRegisteredGuilds,
  addRegisteredGuild,
  removeRegisteredGuild,
};
