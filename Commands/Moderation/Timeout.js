const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const Database = require("../../Schemas/Infractions")
const ms = require("ms");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("timeout")
        .setDescription("Restrict a member's ability to communicate.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setDMPermission(false)
        .addUserOption(options => options
            .setName("target")
            .setDescription("Select the target member")
            .setRequired(true)
        )
        .addStringOption(options => options
            .setName("duration")
            .setDescription("Provide a duriation for this timeout (1m, 1h, 1d)")
            .setRequired(true)
        )
        .addStringOption(options => options
            .setName("reason")
            .setDescription("Provide a reason for this timeout")
            .setMaxLength(512)
        ),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const { options, guild, member } = interaction;

        const target = options.getMember("target");
        const duration = options.getString("duration");
        const reason = options.getString("reason") || "None specified";

        const errorsArray = [];

        const errorsEmbed = new EmbedBuilder()
            .setAuthor({ name: "Could not timeout member due to" })
            .setColor("Red")

        if (!target) return interaction.reply({
            embeds: [errorsEmbed.setDescription("Error » Member has left the guild")],
            ephemeral: true
        });

        if (!ms(duration) || ms(duration) > ms("28d"))
            errorsArray.push("Error » Time provided is invalid or over the 28d limit");

        if (!target.manageable || !target.moderatable)
            errorsArray.push("Error » Selected target is not moderatable by this bot");

        if (member.roles.highest.position < target.roles.highest.position)
            errorsArray.push("Error » Selected member has a higher role position than you")

        if (errorsArray.length)
            return interaction.reply({
                embeds: [errorsEmbed.setDescription(errorsArray.join("\n"))],
                ephemeral: true
            });

        target.timeout(ms(duration), reason).catch((err) => {
            interaction.reply({
                embeds: [errorsEmbed.setDescription("Error » Could not timeout due to an uncommon error")]
            })

            return console.log("Error occured in Timeout.js", err)

        });

        const newInfractionsObject = {
            IssuerID: member.id,
            IssuerTag: member.user.tag,
            Reason: reason,
            Date: Date.now()
        }

        let userData = await Database.findOne({ Guild: guild.id, User: target.id });
        if (!userData) userData = await Database.create({ Guild: guild.id, User: target.id, Infractions: [newInfractionsObject] });
        else userData.Infractions.push(newInfractionsObject) && await userData.save();

        const successEmbed = new EmbedBuilder()
            .setTitle(`Timeout`)
            .setColor("DarkVividPink")
            .addFields(
                { name: 'USER', value: `${target}\n`, inline: true },
                { name: 'BY STAFF', value: `${member} \n`, inline: true },
                { name: '\u200B', value: '\u200B', inline: true },
                { name: 'TIME', value: `${ms(ms(duration), { long: true })}`, inline: false },
                { name: 'REASON', value: `${reason}\n`, inline: true },
                { name: 'WARN', value: `${userData.Infractions.length}`, inline: false },
            )
            .setTimestamp()

        return interaction.reply({ embeds: [successEmbed] })
    }
}