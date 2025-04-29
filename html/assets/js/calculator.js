// Time Converter Script using Moment.js and Moment Timezone

const timezones = moment.tz.names();

// Populate timezone select dropdown
function populateTimezoneSelect() {
    console.log("populateTimezoneSelect called");
    if (!timezones || timezones.length === 0) {
        console.error("Timezone list is empty or undefined");
        const resultDiv = document.getElementById('conversion-result');
        if (resultDiv) {
            resultDiv.textContent = 'Error: Timezone data not loaded properly.';
        }
        return;
    }
    const select = document.getElementById('timezone-select');
    if (!select) {
        console.error("Timezone select element not found");
        return;
    }
    timezones.forEach(tz => {
        const option = document.createElement('option');
        option.value = tz;
        option.textContent = tz;
        select.appendChild(option);
    });
    console.log("Timezone select populated with options");
}

// Handle form submission for time conversion
function handleConversion(event) {
    event.preventDefault();
    const inputDateTime = document.getElementById('input-datetime').value;
    const timezone = document.getElementById('timezone-select').value;
    const resultDiv = document.getElementById('conversion-result');

    if (!inputDateTime) {
        resultDiv.textContent = 'Please enter a valid date and time.';
        return;
    }
    if (!timezone) {
        resultDiv.textContent = 'Please select a timezone.';
        return;
    }

    // Parse input as UTC and convert to selected timezone
    const utcMoment = moment.utc(inputDateTime);
    const converted = utcMoment.tz(timezone);
    resultDiv.textContent = `Converted time in ${timezone}: ${converted.format('YYYY-MM-DD HH:mm:ss z')}`;
}

// Initialize the converter
function init() {
    console.log("init called");
    populateTimezoneSelect();
    const form = document.getElementById('converter-form');
    if (form) {
        form.addEventListener('submit', handleConversion);
        console.log("Form submit event listener added");
    } else {
        console.error("Converter form not found");
    }
}

document.addEventListener('DOMContentLoaded', init);
