const {
    google
} = require('googleapis');
require('dotenv').config();
const time_regex = /(\d{2}):(\d{2}):\d{2}/;
var hour_regex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
// Provide the required configuration
const CREDENTIALS = JSON.parse(process.env.CRED);
const calendarId = process.env.CAL_ID;




// Google calendar API settings
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({
    version: "v3"
});

const auth = new google.auth.JWT(
    CREDENTIALS.client_email,
    null,
    CREDENTIALS.private_key,
    SCOPES
);


// Your TIMEOFFSET Offset
const TIMEOFFSET = '+00:00';

// Get all the events between two dates
const getEvents = async (dateTimeStart, dateTimeEnd) => {

    try {
        let response = await calendar.events.list({
            auth: auth,
            calendarId: calendarId,
            timeMin: dateTimeStart,
            timeMax: dateTimeEnd,
            timeZone: 'GMT'
        });

        let items = response['data']['items'];
        return items;
    } catch (error) {
        console.log(`Error at getEvents --> ${error}`);
        return 0;
    }
};


async function isValidDate(year, month, day, date) {
    return date.getFullYear() == year &&
        date.getMonth() == month &&
        date.getDate() == day;
}

async function checkHour(hour){
    return hour_regex.test(hour);
}
// Get date-time string for calender
const dateTimeForCalander = async (day, month, year, timeStart, duration) => {
    if(!checkHour(timeStart)){
        console.log("wrong time format for start time")
        return;
    }else if(!checkHour(duration)){
        console.log("wrong time format for duration")
        return;
    }
    let date = new Date(year, month, day);
    duration = duration > 2 ? 2 : duration;
    if (!isValidDate(year, month, day, date)) {
        console.log("not valid")
        return;
    }
    if (month < 10) {
        month = `0${month}`;
    }
    if (day < 10) {
        day = `0${day}`;
    }
    let hour = timeStart
    console.log("Hours: " + hour)
    if (hour < 10) {
        hour = `0${hour}`;
    }
    let minute = 0;
    if (minute < 10) {
        minute = `0${minute}`;
    }
    let newDateTime = `${year}-${month}-${day}T${hour}:${minute}.000${TIMEOFFSET}`;

    let event = new Date(Date.parse(newDateTime));

    let startDate = event;
    // Delay in end time is 1
    let endDate = new Date(new Date(startDate).setHours(startDate.getHours() + 2));
    let available = false;
    await getEvents(startDate, endDate)
        .then((res) => {
            available = res.length == 0 ? true : false;

        })
        .catch((err) => {
            console.log(err);
        });

    if (available == false) {
        console.log("No Time Available")
        return null;
    } else {
        return {
            'start': startDate,
            'end': endDate
        }
    }
};

// Insert new event to Google Calendar
const insertEvent = async (event) => {
    try {
        let response = await calendar.events.insert({
            auth: auth,
            calendarId: calendarId,
            resource: event
        });

        if (response['status'] == 200 && response['statusText'] === 'OK') {
            console.log("Your Booking Referance is:", response['data'].id)
            return 1;
        } else {
            return 0;
        }
    } catch (error) {
        return (`Error at insertEvent --> ${error}`);
    }
};

 async function handleNewEvent(day, month, year, timeStart, duration) {
    let dateTime = await dateTimeForCalander(day, month, year, timeStart, duration);
    if (dateTime != null) {
        // Event for Google Calendar
        let event = {
            'summary': `This is the summary.`,
            'description': `This is the description.`,
            'start': {
                'dateTime': dateTime['start'],
                'timeZone': 'GMT'
            },
            'end': {
                'dateTime': dateTime['end'],
                'timeZone': 'GMT'
            }
        };
        insertEvent(event)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log("error happened here")
                console.log(err);
            });
    }

}



 function getEventForDay(year, month, day) {
    month = month < 10 ? `0${month}` : month
    day = day < 10 ? `0${day}` : day

    let start = `${year}-${month}-${day}T00:00:00+00:00`;
    let end = `${year}-${month}-${day}T23:59:59+00:00`;



    getEvents(start, end)
        .then((res) => {
            res.forEach(el => {
                let startTimeSlice = el.start.dateTime.match(time_regex);
                let start = startTimeSlice[1] + ":" + startTimeSlice[2];
                let endTimeSlice = el.end.dateTime.match(time_regex);
                let end = endTimeSlice[1] + ":" + endTimeSlice[2];
                console.log("Start: ", start)
                console.log("END: ", end)
            })
        })
        .catch((err) => {
            console.log(err);
        });
}

// getEventForDay(2023, 03, 03);

 const deleteEvent = async (eventId) => {

    try {
        let response = await calendar.events.delete({
            auth: auth,
            calendarId: calendarId,
            eventId: eventId
        });

        if (response.data === '') {
            return 1;
        } else {
            return 0;
        }
    } catch (error) {
        console.log(`Error at deleteEvent --> ${error}`);
        return 0;
    }
};
module.exports = {deleteEvent, insertEvent, handleNewEvent,checkHour};