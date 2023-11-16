const { EmbedBuilder, Client, ChatInputCommandInteraction, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("volume")
        .setDescription("Alter the volume")
        .addNumberOption(options => options
            .setName("percent")
            .setDescription("1% - 100%")
            .setRequired(true)
            )
        .setDMPermission(false),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { member, guild, options, channel } = interaction;
        const VoiceChannel = member.voice.channel;
        const volume = options.getNumber("percent")

        const embed = new EmbedBuilder()

        if (!VoiceChannel) {
            embed.setColor("DarkVividPink").setDescription("⛔ You must be in a voice channel to execute music commands.");
            return interaction.reply({ embeds: [embed], ephemeral: true })
        }
        if (!member.voice.channelId == guild.members.me.voice.channelId) {
            embed.setColor("DarkVividPink").setDescription(`⛔ You can't use the music player as it is already active in <#${guild.members.me.voice.channelId}>`);
            return interaction.reply({ embeds: [embed], ephemeral: true })
        }

        const queue = await client.distube.getQueue(VoiceChannel);
        if (!queue) {
            embed.setColor("DarkVividPink").setDescription("⛔ There is no queue")
            return interaction.reply({ embeds: [embed], ephemeral: true })
        }


        if(volume > 100 || volume < 1) {
            embed.setColor("DarkVividPink").setDescription("⛔ You have to specify a number between 1% and 100%");
            return interaction.reply({embeds: [embed]}) 
        }

        client.distube.setVolume(VoiceChannel, volume);

        embed.setColor("DarkVividPink").setDescription(`<a:check_mark:1102229851588538368> Volume has been set to ${volume}%!`)
        return interaction.reply({ embeds: [embed] });
    }
}