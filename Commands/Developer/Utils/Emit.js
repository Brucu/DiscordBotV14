const { SlashCommandBuilder, PermissionFlagsBits, Client, ChatInputCommandInteraction } = require("discord.js");

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName("emit")
        .setDescription("Emit the guildMemberAdd/Remove events.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setDMPermission(false),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} Client 
     */
    execute(interaction, Client) {
        Client.emit("guildMemberAdd", interaction.member);

        interaction.reply({ content: "Emitted GuildMemberAdd", ephemeral: true })
    }
}