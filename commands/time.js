const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('time')
		.setDescription('Replies with your current time'),
	async execute(interaction) {
        var d = new Date();
		await interaction.reply(d.toLocaleDateString());
	},
};