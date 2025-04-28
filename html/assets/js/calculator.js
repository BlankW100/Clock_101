var time = "10:00";
var date = "2023-10-01";
var timeZone = "America/New_York";

var c = moment.tz(date + " " + time, timeZone);
console.log(c.format()) ;