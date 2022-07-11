const {Client, CommandInteraction, MessageEmbed} = require("discord.js");
const { moderation_embed_colour, guild_logs_id } = require("../../structures/config.json");

module.exports = {
	name: "unban",
	description: "Used to unban a target id.",
	userPermissions: ["BAN_MEMBERS"],
	usage: "/unban",
	disabled: false,
	options: [{
			name: "id",
			description: "Provide a user id to unban.",
			type: "STRING",
			required: true
		},
		// {
		// 	name: "reason",
		// 	description: "Provide a reason for the unban.",
		// 	type: "STRING",
		// 	required: false
		// }
	],
	/**
	 * @param {CommandInteraction} interaction
     * @param {Client} client
	 */
	async execute(interaction, client) {
		const userID = interaction.options.getString("id");

		if (!interaction.member.permissions.has("BAN_MEMBERS"))
			return interaction.reply({ embeds: [client.errorEmbed("You need the permission \`BAN_MEMBERS\` to be able to unban members.")], ephemeral: true })

		// const reason = interaction.options.getString("reason");

		// if (reason?.length > 512)
        //     return interaction.reply({ embeds: [client.errorEmbed("Reason cannot be longer than 512 characters.")], ephemeral: true });

		await interaction.guild.members.unban(userID).then((user) => {
			return interaction.reply({ embeds: [client.successEmbed(`\`${user.tag}\` was successfully unbanned from this server.`)]})
		}).catch(() => {
			return interaction.reply({ embeds: [client.errorEmbed("Please specify a valid banned member's ID.")]})
		})     
	}
}