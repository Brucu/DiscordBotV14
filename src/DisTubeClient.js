const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const client = require("./discordClient");

client.distube = new DisTube(client, {
    emitNewSongOnly: true,
    leaveOnEmpty: true,
    emitAddSongWhenCreatingQueue: false,
    plugins: [new SpotifyPlugin()],
})
module.exports = client;