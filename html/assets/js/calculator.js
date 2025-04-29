// Time Converter Script using Moment.js and Moment Timezone

const timezones = moment.tz.names();

// Populate timezone select dropdown
function populateTimezoneSelect() {
    const select = document.getElementById('timezone-select');
    timezones.forEach(tz => {
        const option = document.createElement('option');
        option.value = tz;
        option.textContent = tz;
        select.appendChild(option);
    });
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
    populateTimezoneSelect();
    document.getElementById('converter-form').addEventListener('submit', handleConversion);
}

document.addEventListener('DOMContentLoaded', init);
