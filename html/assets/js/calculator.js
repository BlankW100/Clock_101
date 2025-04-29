var time = "10:00";
var date = "2023-10-01";
var timeZone = "America/New_York";

var c = moment.tz(date + " " + time, timeZone);
console.log(c.format()) ;

const DateTime = luxon.DateTime;
var dt = DateTime.fromISO(c.format());

dt = dt.setZone("Japan/Tokyo");
console.log(dt.toIso(suppressMillisconds=true)) ;
console.log(dt.toLocalString(DateTime.DATETIME_FULL)) ;
