const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('timelol')
		.setDescription('Replies with your current time')
		.addIntegerOption(option => option.setName('year').setDescription('Year'))
		.addIntegerOption(option => option.setName('month').setDescription('Month'))
		.addIntegerOption(option => option.setName('day').setDescription('Day')),
	async execute(interaction) {
		var date = {
			year: interaction.options.getInteger('year'),
			month: interaction.options.getInteger('month')-1,
			day: interaction.options.getInteger('day'),
		};
		// var member = interaction.options.getString('date');
		var actualdate = new Date(date.year, date.month, date.day);
		var dString = actualdate.toLocaleDateString()
		await interaction.reply(dString);
	},
};