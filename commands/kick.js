const {
	SlashCommandBuilder
} = require('discord.js');
const {
	handleNewEvent,
	checkHour
} = require('../index');

async function isValidNumber(number){
	return (/^[0-9]+$/).test(number);
}
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
		let year = interaction.options.getInteger('year');
		let month = interaction.options.getInteger('month');
		let day =  parseInt(interaction.options.getInteger('day'));
		let startingTime = interaction.options.getString('starting-time');
		let hours = startingTime.split(":")[0];
		let minutes = startingTime.split(":")[1];

		console.log("Hours " + hours + "Minutes " + minutes)
		console.log(typeof(minutes))
		if(await !isValidNumber(hours)) {
			return interaction.reply("Please input start time in this format HH:MM");
		}
		
		if(minutes != '00' && minutes != '30'){
			return interaction.reply("Please input start time in this format HH:MM in increment of 30");
		}


		if(await !isValidNumber(minutes) ){
			return interaction.reply("Please input start time in this format HH:MM");
		}
		hours = hours < 10 ? `0${hours}` : hours;
		minutes = (minutes < 10 && minutes > 0) ? `0${minutes}` : minutes;
		let duration = interaction.options.getString('duration');
		startingTime = hours + ":" + minutes;
		
		if (!await checkHour(startingTime)) {
			return interaction.reply("Invalid Start Time Please enter hour in (HH:MM) format like 23:00 for 11 PM")
		}
		
		let wantedDate;
		try {
			wantedDate = new Date(year,month - 1 ,day)
		} catch (err) {
			return interaction.reply('Invalid Date');
		}

		if (!(wantedDate.getFullYear() ==  year && wantedDate.getMonth() ==  (month-1) && wantedDate.getDate() == day)) {
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

		await handleNewEvent(day, month, year, startingTime, duration)
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