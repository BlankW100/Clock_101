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

// Populate timezone list dynamically based on search input
function populateTimezoneList(searchTerm = "") {
    const timezoneList = document.getElementById("timezone-list");
    timezoneList.innerHTML = ""; // Clear the list

    const filteredTimezones = timezones.filter((tz) =>
        tz.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredTimezones.length === 0) {
        const noResultItem = document.createElement("li");
        noResultItem.textContent = "No results found";
        noResultItem.className = "p-2 text-gray-500";
        timezoneList.appendChild(noResultItem);
        return;
    }

    filteredTimezones.forEach((tz) => {
        const listItem = document.createElement("li");
        listItem.textContent = tz;
        listItem.className = "p-2 cursor-pointer hover:bg-gray-200";
        listItem.addEventListener("click", () => {
            document.getElementById("timezone-search").value = tz;
            timezoneList.innerHTML = ""; // Clear the list after selection
        });
        timezoneList.appendChild(listItem);
    });
}

// Handle search input for timezones
function handleTimezoneSearch(event) {
    const searchTerm = event.target.value;
    populateTimezoneList(searchTerm);
}

// Handle form submission for time conversion
function handleConversion(event) {
    event.preventDefault();
    const inputDateTime = document.getElementById('input-datetime').value;
    const timezone = document.getElementById('timezone-search').value;
    const resultDiv = document.getElementById('conversion-result');

    if (!inputDateTime) {
        resultDiv.textContent = 'Please enter a valid date and time.';
        return;
    }
    if (!timezone || !timezones.includes(timezone)) {
        resultDiv.textContent = 'Please select a valid timezone.';
        return;
    }

    // Parse input as UTC and convert to selected timezone
    const utcMoment = moment.utc(inputDateTime);
    const converted = utcMoment.tz(timezone);
    resultDiv.textContent = `Converted time in ${timezone}: ${converted.format('YYYY-MM-DD HH:mm:ss z')}`;
}

// Initialize the converter with search functionality
function init() {
    console.log("Initializing Timezone Converter...");
    populateTimezoneList(); // Populate the full list initially

    const searchInput = document.getElementById("timezone-search");
    if (searchInput) {
        searchInput.addEventListener("input", handleTimezoneSearch);
        console.log("Search input event listener added");
    } else {
        console.error("Timezone search input not found");
    }

    const form = document.getElementById("converter-form");
    if (form) {
        form.addEventListener("submit", handleConversion);
        console.log("Form submit event listener added");
    } else {
        console.error("Converter form not found");
    }
}

document.addEventListener("DOMContentLoaded", init);
