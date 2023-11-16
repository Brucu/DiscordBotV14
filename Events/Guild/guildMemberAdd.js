const { GuildMember, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const moment = require('moment');

module.exports = {
    name: "guildMemberAdd",
    description: "Guild Member Add",
    /**
     * 
     * @param {GuildMember} member
     * 
     */
    async execute(member, client) {

        const guildConfig = client.guildConfig.get(member.guild.id);
        if (!guildConfig) return;

        const guildRoles = member.guild.roles.cache;
        let assignedRole = member.user.bot ? guildRoles.get(guildConfig.botRole) : guildRoles.get(guildConfig.memberRole);

        if (!assignedRole) assignedRole = "Not Configured.";
        else await member.roles.add(assignedRole).catch(() => assignedRole = "Failed due to role hierarchy!");

        const logChannel = (await member.guild.channels.fetch()).get(guildConfig.logChannel);
        if (!logChannel) return;

        let color = "Green";
        let risk = "Fairly Safe";

        const accountCreation = parseInt(member.user.createdTimestamp / 1000);
        const joiningTime = parseInt(member.joinedAt / 1000);

        const monthsAgo = moment().subtract(2, "months").unix();
        const weeksAgo = moment().subtract(2, "weeks").unix();
        const daysAgo = moment().subtract(2, "days").unix();

        if (accountCreation >= monthsAgo) {
            color = "Yellow";
            risk = "Medium";
        }
        if (accountCreation >= weeksAgo) {
            color = "Orange";
            risk = "High";
        }
        if (accountCreation >= daysAgo) {
            color = "Red";
            risk = "Extreme";
        }

        const Embed = new EmbedBuilder()
            .setAuthor({ name: `${member.user.tag} | ${member.id}`, iconURL: member.displayAvatarURL({ dynamic: true }) })
            .setColor(color)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
            .setDescription([
                `👤 User: ${member.user}`,
                `❔ Account Type: ${member.user.bot ? "Bot" : "User"} `,
                `❔ Role Assigned: ${assignedRole}`,
                `☢️ Risk Level: ${risk}`,
                `✍🏻 Account Created: <t:${accountCreation}:D> | <t:${accountCreation}:R>`,
                `👥 Account Joined: <t:${joiningTime}:D> | <t:${joiningTime}:R>`,
            ].join("\n"))
            .setFooter({ text: "Joined" })
            .setTimestamp();

        if (risk == "Extreme" || risk == "High") {
            const Buttons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`MemberLogging-Kick-${member.id}`)
                        .setLabel("Kick")
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId(`MemberLogging-Ban-${member.id}`)
                        .setLabel("Ban")
                        .setStyle(ButtonStyle.Danger)
                );

            return logChannel.send({ embeds: [Embed], components: [Buttons] });

        } else return logChannel.send({ embeds: [Embed] });

    }
}