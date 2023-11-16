const { ChatInputCommandInteraction, SlashCommandBuilder, Client, EmbedBuilder } = require("discord.js");
const wait = require("node:timers/promises")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Will respond with pong."),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client
     */
    async execute(interaction, client) {

        await interaction.deferReply();

        const reply = await interaction.fetchReply();
        const ping = reply.createdTimestamp - interaction.createdTimestamp;

        const embed = new EmbedBuilder()
        embed.setColor("DarkVividPink").setDescription(`🏓 Latency is ${ping}ms | API Latency is ${client.ws.ping}ms`)
        interaction.editReply({embeds: [embed]});
    }
}