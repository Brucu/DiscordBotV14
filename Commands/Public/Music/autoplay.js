const { EmbedBuilder, Client, ChatInputCommandInteraction, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("autoplay")
        .setDescription("Toggle Autoplay Modes")
        .setDMPermission(false),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { member, guild, options, channel } = interaction;
        const VoiceChannel = member.voice.channel;

        const embed = new EmbedBuilder()

        if(!VoiceChannel) {
            embed.setColor("DarkVividPink").setDescription("⛔ You must be in a voice channel to execute music commands.");
            return interaction.reply({embeds: [embed], ephemeral: true});
        }
        if (!member.voice.channelId == guild.members.me.voice.channelId) {
            embed.setColor("DarkVividPink").setDescription(`⛔ You can't use the music player as it is already active in <#${guild.members.me.voice.channelId}>`);
            return interaction.reply({embeds: [embed], ephemeral: true});
        }

        const queue = await client.distube.getQueue(VoiceChannel);
        if (!queue) {
            embed.setColor("DarkVividPink").setDescription("⛔ There is no queue")
            return interaction.reply({embeds: [embed], ephemeral: true});
        }

        let Mode = await queue.toggleAutoplay(VoiceChannel);

        embed.setColor("DarkVividPink").setDescription(`🔁 Autoplay Mode is set to: ${Mode ? "On" : "Off"}`)
        return interaction.reply({embeds: [embed]});
    }
}