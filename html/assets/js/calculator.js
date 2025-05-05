// Time Converter Script using Moment.js and Moment Timezone

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBiOkxZFBwCP3NOXqZqpit5tF9MnwKaavQ",
    authDomain: "clock-101-10e68.firebaseapp.com",
    projectId: "clock-101-10e68",
    storageBucket: "clock-101-10e68.firebasestorage.app",
    messagingSenderId: "654434052980",
    appId: "1:654434052980:web:d270879ef90c796a059a21",
    measurementId: "G-VHP3DZEB3G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const timezones = moment.tz.names();

// Add a timezone to the user's favorites on right-click
async function handleRightClickToAddFavorite(event) {
    event.preventDefault(); // Prevent the default context menu
    const timezone = event.target.textContent;
    if (timezone && timezones.includes(timezone)) {
        await addFavoriteTimezone(timezone);
    } else {
        console.error("Invalid timezone selected.");
    }
}

// Populate timezone list dynamically for output timezone with right-click functionality
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
        listItem.addEventListener("contextmenu", handleRightClickToAddFavorite); // Add right-click functionality
        timezoneList.appendChild(listItem);
    });
}

// Populate timezone list dynamically for input timezone with right-click functionality
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
        listItem.addEventListener("contextmenu", handleRightClickToAddFavorite); // Add right-click functionality
        inputTimezoneList.appendChild(listItem);
    });
}

// Fetch and display favorite timezones
async function fetchFavoriteTimezones() {
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
        console.error("No userId found in sessionStorage!");
        return;
    }

    const userDoc = doc(db, "users", JSON.parse(userId));
    const userSnapshot = await getDoc(userDoc);

    if (userSnapshot.exists()) {
        const favTimezones = userSnapshot.data().fav_tz || [];
        displayFavoriteTimezones(favTimezones);
    } else {
        console.error("No such user document!");
    }
}

// Display favorite timezones in the "Favorite Timezones" section
function displayFavoriteTimezones(favTimezones) {
    const favTimezonesList = document.getElementById("fav-timezones");
    favTimezonesList.innerHTML = ""; // Clear the list

    if (favTimezones.length === 0) {
        const noFavItem = document.createElement("li");
        noFavItem.textContent = "No favorite timezones yet.";
        noFavItem.className = "p-2 text-gray-500";
        favTimezonesList.appendChild(noFavItem);
        return;
    }

    favTimezones.forEach((tz) => {
        const listItem = document.createElement("li");
        listItem.textContent = tz;
        listItem.className = "p-2 cursor-pointer hover:bg-gray-200";
        listItem.addEventListener("click", () => {
            document.getElementById("input-timezone-search").value = tz;
        });
        favTimezonesList.appendChild(listItem);
    });
}

// Add a timezone to the user's favorites
async function addFavoriteTimezone(timezone) {
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
        console.error("No userId found in sessionStorage!");
        return;
    }

    const userDoc = doc(db, "users", JSON.parse(userId));
    const userSnapshot = await getDoc(userDoc);

    if (userSnapshot.exists()) {
        const favTimezones = userSnapshot.data().fav_tz || [];
        if (!favTimezones.includes(timezone)) {
            favTimezones.push(timezone);
            await updateDoc(userDoc, { fav_tz: favTimezones });
            displayFavoriteTimezones(favTimezones);
        } else {
            console.log("Timezone is already in favorites.");
        }
    } else {
        console.error("No such user document!");
    }
}

//  adding a timezone to favorites
function handleAddToFavorites(event) {
    const timezone = event.target.value;
    if (timezone && timezones.includes(timezone)) {
        addFavoriteTimezone(timezone);
    } else {
        console.error("Invalid timezone selected.");
    }
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

// Initialize the converter with favorite timezone functionality
function init() {
    console.log("Initializing Timezone Converter...");
    fetchFavoriteTimezones(); // Fetch and display favorite timezones
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

    const addToFavoritesButton = document.getElementById("add-to-favorites");
    if (addToFavoritesButton) {
        addToFavoritesButton.addEventListener("click", handleAddToFavorites);
        console.log("Add to favorites button event listener added");
    } else {
        console.error("Add to favorites button not found");
    }
}

document.addEventListener("DOMContentLoaded", init);
