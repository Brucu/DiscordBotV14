require("dotenv").config();

const client = require("./discordClient");
const { Collection } = require("discord.js");

client.events = new Collection();
client.subCommands = new Collection();
client.commands = new Collection();
client.guildConfig = new Collection();

const { connect, default: mongoose } = require("mongoose");
mongoose.set("strictQuery", false)
connect(process.env.DATABASEURL, {
})

const { loadEvents } = require("../Handlers/eventHandler");
loadEvents(client)

const { loadConfig } = require("../Functions/configLoader");
loadConfig(client)

client.login(process.env.TOKEN).then(() => {
    client.user.setActivity(`On ${client.guilds.cache.size} server(s)`);
}).catch((err) => console.log(err));

