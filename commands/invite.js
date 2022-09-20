const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('invite')
		.setDescription('Get my Invite link'),
	async execute(interaction) {
     
        let link = "https://discord.com/api/oauth2/authorize?client_id=" + interaction.client.user.id + "&permissions=8&scope=bot",
            invite = "https://discord.gg/KJjZnxZ"

		await interaction.reply(`**Invite Links**\n[Bot-Invite](${link})\n[Support Server](${invite})`);
	},
};