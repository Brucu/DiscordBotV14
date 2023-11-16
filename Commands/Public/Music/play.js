const { EmbedBuilder, Client, ChatInputCommandInteraction, SlashCommandBuilder } = require("discord.js");
const wait = require('node:timers/promises').setTimeout;
const client = require("../../../src/discordClient");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play a song")
        .setDMPermission(false)
        .addStringOption(options => options
            .setName("query")
            .setDescription("Provide a name or a url for the song")
            .setRequired(true)
        ),
        /**
         * 
         * @param {ChatInputCommandInteraction} interaction 
         * @param {Client} client 
         */
        async execute(interaction, client) {
            const { member, guild, options, channel } = interaction;
            const VoiceChannel = member.voice.channel;

            const embed = new EmbedBuilder();

            if (!VoiceChannel) {
                embed.setColor("DarkVividPink").setDescription("⛔ You must be in a voice channel to execute music commands.");
                return interaction.reply({embeds: [embed], ephemeral: true});
            }

            if (!member.voice.channelId == guild.members.me.voice.channelId) {
                embed.setColor("DarkVividPink").setDescription(`⛔ You can't use the music player as it is already active in <#${guild.members.me.voice.channelId}>`);
                return interaction.reply({embeds: [embed], ephemeral: true});
            }

            client.distube.play( VoiceChannel, options.getString("query"), { textChannel: channel, member: member})
                interaction.reply({content: "<a:check_mark:1102229851588538368> Request received."});
                await wait(800);
                return interaction.deleteReply();
        }
}