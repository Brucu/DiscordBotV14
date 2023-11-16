const { ChatInputCommandInteraction, client } = require("discord.js");
const { loadCommands } = require("../../../Handlers/commandHandler");

module.exports = {
    subCommand: "reload.commands",
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {client} client 
     */
    execute(interaction, client) {
        loadCommands(client);
        interaction.reply({ content: "Reloaded Commands", ephemeral: true })
    }
}