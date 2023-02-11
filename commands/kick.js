const {
	SlashCommandBuilder
} = require('discord.js');
const {
	handleNewEvent,
	checkHour
} = require('../index');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Replies with your current time')
		.addIntegerOption(option => option.setName('year').setDescription('Year'))
		.addIntegerOption(option => option.setName('month').setDescription('Month'))
		.addIntegerOption(option => option.setName('day').setDescription('Day'))
		.addStringOption(option => option.setName('starting-time').setDescription('Starting Hour (e.g. HH:MM => 04:30)'))
		.addStringOption(option => option.setName('duration').setDescription('Duration (e.g. HH:MM => 04:30)')),
	async execute(interaction) {
		var date = {
			year: interaction.options.getInteger('year'),
			month: parseInt(interaction.options.getInteger('month')),
			day: parseInt(interaction.options.getInteger('day')),
			startingtime: interaction.options.getString('starting-time'),
			duration: interaction.options.getString('duration'),

		};

		if (!checkHour(date.startingtime)) {
			return interaction.reply("Invalid Start Time Please enter hour in (HH:MM) format like 23:00 for 11 PM")
		} else if (!checkHour(date.duration)) {
			return interaction.reply("Invalid Start Time Please enter hour in (HH:MM) format like 1:00 for 1 hour")
		}
		if (date.month < 1 || date.month > 12) {
			return interaction.reply('Month invalid');
		}
		if (date.day < 1 || date.day > 31) {
			return interaction.reply('Day invalid');
		}
		let wantedDate;
		try {
			wantedDate = new Date(date.year, date.month - 1 , date.day)
		} catch (err) {
			return interaction.reply('Invalid Date');
		}

		if (!(wantedDate.getFullYear() ==  date.year && wantedDate.getMonth() ==  (date.month-1) && wantedDate.getDate() == date.day)) {
			return interaction.reply('Invalid Date: Please check date');
		}
		if (await weekDiff(wantedDate) > 2 ) {
			console.log(await weekDiff(wantedDate))
			return interaction.reply('Please only book two weeks in advance!');
		}else if(await weekDiff(wantedDate) < 0){
			return interaction.reply('Ofcourse, Time travel does not exist. Please only book for dates in future');
		}

		// // var member = interaction.options.getString('date');
		// var actualdate = new Date(date.year, date.month, date.day);

		await handleNewEvent(date.day, date.month, date.year, date.startingtime, date.duration)
		// var dString = actualdate.toLocaleDateString()
		// await interaction.reply(dString);
	},
};


async function weekDiff(bookedDate) {
	let weeks,
		currentDate = new Date();
	weeks = Math.floor((bookedDate - currentDate) / (7 * 24 * 60 * 60 * 1000));
	return weeks;
}