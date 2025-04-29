var time = "10:00";
var date = "2023-10-01";
var timeZone = "America/New_York";

var c = moment.tz(date + " " + time, timeZone);
console.log(c.format());

const DateTime = luxon.DateTime;
var dt = DateTime.fromISO(c.format());

dt = dt.setZone("Japan/Tokyo");
console.log(dt.toISO({ suppressMilliseconds: true })); 
console.log(dt.toLocaleString(DateTime.DATETIME_FULL));

// Populate dropdown menus with all available time zones
function populateTimeZones() {
    const timeZones = moment.tz.names(); // Get all available time zones
    const startingAreaSelect = document.getElementById("starting-area");
    const targetTimeZoneSelect = document.getElementById("timezone");

    // Populate both dropdowns with time zones
    timeZones.forEach((zone) => {
        const option1 = document.createElement("option");
        option1.value = zone;
        option1.textContent = zone;
        startingAreaSelect.appendChild(option1);

        const option2 = document.createElement("option");
        option2.value = zone;
        option2.textContent = zone;
        targetTimeZoneSelect.appendChild(option2);
    });
}

// Convert time from one timezone to another
function convertTime() {
    const startingArea = document.getElementById("starting-area").value;
    const dateInput = document.getElementById("dateInput").value;
    const timeInput = document.getElementById("timeInput").value;
    const targetTimeZone = document.getElementById("timezone").value;

    if (!startingArea || !dateInput || !timeInput || !targetTimeZone) {
        document.getElementById("result").textContent = "Please fill in all fields.";
        return;
    }

    // Combine date and time into a single string
    const dateTimeString = `${dateInput} ${timeInput}`;

    // Parse the input date and time in the starting timezone
    const startingMoment = moment.tz(dateTimeString, startingArea);

    // Convert to the target timezone
    const targetMoment = startingMoment.clone().tz(targetTimeZone);

    // Display the result
    document.getElementById("result").textContent = `Converted Time: ${targetMoment.format("YYYY-MM-DD HH:mm:ss")} (${targetTimeZone})`;
}

// Event listener for the convert button
document.getElementById("convertButton").addEventListener("click", convertTime);

// Populate the dropdown menus on page load
populateTimeZones();
