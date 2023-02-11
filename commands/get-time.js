const {
	SlashCommandBuilder
} = require('discord.js');
const {
	handleNewEvent,
	checkHour
} = require('../index');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('get-time')
		.setDescription('Replies with available times at the specified date')
		.addIntegerOption(option => option.setName('year').setDescription('Year'))
		.addIntegerOption(option => option.setName('month').setDescription('Month'))
		.addIntegerOption(option => option.setName('day').setDescription('Day')),
	async execute(interaction) {
		var date = {
			year: interaction.options.getInteger('year'),
			month: parseInt(interaction.options.getInteger('month')),
			day: parseInt(interaction.options.getInteger('day')),
		};
        
		let output = await validateDate(date);

		if(output = ''){
		return interaction.reply(output)
		}

		// // var member = interaction.options.getString('date');
		// var actualdate = new Date(date.year, date.month, date.day);

		await PUT_FETCH_BOOKINGS_FUNCTION(date.day, date.month, date.year)
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



async function validateDate(date) {
	const startTime = date.startingtime.split(':');
	const hour = parseInt(startTime[0], 10);
	const minute = parseInt(startTime[1], 10);
	if (isNaN(hour) || hour < 0 || hour > 23) {
	  return 'Invalid Start Time. Please enter hour in (HH:MM) format, like 23:00 for 11 PM';
	}
	if (isNaN(minute) || minute < 0 || minute > 59) {
	  return 'Invalid Start Time. Please enter minute in (HH:MM) format, like 23:00 for 11 PM';
	}
	if (date.month < 1 || date.month > 12) {
	  return 'Month invalid';
	}
	if (date.day < 1 || date.day > 31) {
	  return 'Day invalid';
	}
	const wantedDate = new Date(date.year, date.month - 1, date.day);
	if (isNaN(wantedDate.getTime())) {
	  return 'Invalid Date';
	}
	const daysDifference = weekDiff(wantedDate);
	if (daysDifference > 14) {
	  return 'Please only book two weeks in advance';
	} else if (daysDifference < 0) {
	  return 'Time travel does not exist. Please only book for dates in the future';
	}
	return '';
  }
  