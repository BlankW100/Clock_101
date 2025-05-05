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

// Populate timezone list dynamically for input timezone
function populateInputTimezoneList(searchTerm = "") {
    const inputTimezoneList = document.getElementById("input-timezone-list");
    inputTimezoneList.innerHTML = ""; // Clear the list

    const filteredTimezones = timezones.filter((tz) =>
        tz.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredTimezones.length === 0) {
        const noResultItem = document.createElement("li");
        noResultItem.textContent = "No results found";
        noResultItem.className = "p-2 text-gray-500";
        inputTimezoneList.appendChild(noResultItem);
        return;
    }

    filteredTimezones.forEach((tz) => {
        const listItem = document.createElement("li");
        listItem.textContent = tz;
        listItem.className = "p-2 cursor-pointer hover:bg-gray-200";
        listItem.addEventListener("click", () => {
            document.getElementById("input-timezone-search").value = tz;
            inputTimezoneList.innerHTML = ""; // Clear the list after selection
        });
        inputTimezoneList.appendChild(listItem);
    });
}

// Handle search input for timezones
function handleTimezoneSearch(event) {
    const searchTerm = event.target.value;
    populateTimezoneList(searchTerm);
}

// Handle search input for input timezones
function handleInputTimezoneSearch(event) {
    const searchTerm = event.target.value;
    populateInputTimezoneList(searchTerm);
}

// Handle form submission for time conversion
function handleConversion(event) {
    event.preventDefault();
    const inputDateTime = document.getElementById('input-datetime').value;
    const inputTimezone = document.getElementById('input-timezone-search').value;
    const outputTimezone = document.getElementById('timezone-search').value;
    const resultDiv = document.getElementById('conversion-result');

    if (!inputDateTime) {
        resultDiv.textContent = 'Please enter a valid date and time.';
        return;
    }
    if (!inputTimezone || !timezones.includes(inputTimezone)) {
        resultDiv.textContent = 'Please select a valid input timezone.';
        return;
    }
    if (!outputTimezone || !timezones.includes(outputTimezone)) {
        resultDiv.textContent = 'Please select a valid output timezone.';
        return;
    }

    // Parse input as the selected input timezone and convert to the output timezone
    const inputMoment = moment.tz(inputDateTime, inputTimezone);
    const converted = inputMoment.tz(outputTimezone);
    resultDiv.textContent = `Converted time in ${outputTimezone}: ${converted.format('YYYY-MM-DD HH:mm:ss z')}`;
}

// Initialize the converter with search functionality
function init() {
    console.log("Initializing Timezone Converter...");
    populateTimezoneList(); // Populate the full list for output timezone
    populateInputTimezoneList(); // Populate the full list for input timezone

    const inputSearchInput = document.getElementById("input-timezone-search");
    if (inputSearchInput) {
        inputSearchInput.addEventListener("input", handleInputTimezoneSearch);
        console.log("Input timezone search input event listener added");
    } else {
        console.error("Input timezone search input not found");
    }

    const outputSearchInput = document.getElementById("timezone-search");
    if (outputSearchInput) {
        outputSearchInput.addEventListener("input", handleTimezoneSearch);
        console.log("Output timezone search input event listener added");
    } else {
        console.error("Output timezone search input not found");
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
