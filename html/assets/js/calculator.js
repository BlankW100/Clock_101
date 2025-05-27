// Time Converter Script using Moment.js and Moment Timezone

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const timezones = moment.tz.names();
let favTimezones = [];

// Fetch and display favorite timezones from Firestore
async function fetchFavoriteTimezones() {
    const userId = sessionStorage.getItem("userId");
    if (!userId) return;
    const userDoc = doc(db, "users", JSON.parse(userId));
    const userSnapshot = await getDoc(userDoc);
    if (userSnapshot.exists()) {
        favTimezones = userSnapshot.data().fav_tz || [];
    } else {
        favTimezones = [];
    }
    displayFavoriteTimezones();
}

// Save favorite timezones to Firestore
async function saveFavoriteTimezones() {
    const userId = sessionStorage.getItem("userId");
    if (!userId) return;
    const userDoc = doc(db, "users", JSON.parse(userId));
    await setDoc(userDoc, { fav_tz: favTimezones }, { merge: true });
}

// Display favorite timezones as star buttons
function displayFavoriteTimezones() {
    const favList = document.getElementById("fav-timezones");
    favList.innerHTML = "";
    if (favTimezones.length === 0) {
        favList.innerHTML = `<li class="text-gray-500">No favorites yet. Click ★ to add.</li>`;
        return;
    }
    favTimezones.forEach(tz => {
        const li = document.createElement("li");
        li.className = "flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded";
        li.innerHTML = `<span class="text-yellow-500">★</span> <span class="cursor-pointer">${tz}</span>`;
        li.querySelector("span.cursor-pointer").onclick = () => {
            document.getElementById("input-timezone-search").value = tz;
            document.getElementById("timezone-search").value = tz;
        };
        favList.appendChild(li);
    });
}

// Add or remove favorite
async function toggleFavorite(tz) {
    const idx = favTimezones.indexOf(tz);
    if (idx === -1) {
        favTimezones.unshift(tz); // Add to top
    } else {
        favTimezones.splice(idx, 1); // Remove
    }
    await saveFavoriteTimezones();
    displayFavoriteTimezones();
    populateTimezoneList(document.getElementById("timezone-search").value);
    populateInputTimezoneList(document.getElementById("input-timezone-search").value);
}

// Populate timezone list with stars
function populateTimezoneList(searchTerm = "") {
    const timezoneList = document.getElementById("timezone-list");
    timezoneList.innerHTML = "";

    // Prioritize favorites
    let filtered = timezones.filter(tz => tz.toLowerCase().includes(searchTerm.toLowerCase()));
    filtered = [
        ...favTimezones.filter(tz => filtered.includes(tz)),
        ...filtered.filter(tz => !favTimezones.includes(tz))
    ];

    filtered.forEach(tz => {
        const li = document.createElement("li");
        li.className = "flex items-center p-2 cursor-pointer hover:bg-gray-200";
        li.innerHTML = `
            <span class="star text-xl mr-2 ${favTimezones.includes(tz) ? "text-yellow-500" : "text-gray-400"}" style="user-select:none;cursor:pointer;">★</span>
            <span class="flex-1">${tz}</span>
        `;
        li.querySelector(".star").onclick = (e) => {
            e.stopPropagation();
            toggleFavorite(tz);
        };
        li.querySelector("span.flex-1").onclick = () => {
            document.getElementById("timezone-search").value = tz;
            timezoneList.innerHTML = "";
        };
        timezoneList.appendChild(li);
    });
}

// Same for input timezone
function populateInputTimezoneList(searchTerm = "") {
    const inputTimezoneList = document.getElementById("input-timezone-list");
    inputTimezoneList.innerHTML = "";

    let filtered = timezones.filter(tz => tz.toLowerCase().includes(searchTerm.toLowerCase()));
    filtered = [
        ...favTimezones.filter(tz => filtered.includes(tz)),
        ...filtered.filter(tz => !favTimezones.includes(tz))
    ];

    filtered.forEach(tz => {
        const li = document.createElement("li");
        li.className = "flex items-center p-2 cursor-pointer hover:bg-gray-200";
        li.innerHTML = `
            <span class="star text-xl mr-2 ${favTimezones.includes(tz) ? "text-yellow-500" : "text-gray-400"}" style="user-select:none;cursor:pointer;">★</span>
            <span class="flex-1">${tz}</span>
        `;
        li.querySelector(".star").onclick = (e) => {
            e.stopPropagation();
            toggleFavorite(tz);
        };
        li.querySelector("span.flex-1").onclick = () => {
            document.getElementById("input-timezone-search").value = tz;
            inputTimezoneList.innerHTML = "";
        };
        inputTimezoneList.appendChild(li);
    });
}

// Handle search input for timezones
function handleTimezoneSearch(event) {
    const searchTerm = event.target.value;
    populateTimezoneList(searchTerm);
}
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

    const inputMoment = moment.tz(inputDateTime, inputTimezone);
    const converted = inputMoment.tz(outputTimezone);
    resultDiv.textContent = `Converted time in ${outputTimezone}: ${converted.format('YYYY-MM-DD HH:mm:ss z')}`;
}

// Initialize the converter with favorite timezone functionality
function init() {
    fetchFavoriteTimezones().then(() => {
        populateTimezoneList();
        populateInputTimezoneList();
    });

    document.getElementById("input-timezone-search").addEventListener("input", handleInputTimezoneSearch);
    document.getElementById("timezone-search").addEventListener("input", handleTimezoneSearch);
    document.getElementById("converter-form").addEventListener("submit", handleConversion);
}

document.addEventListener("DOMContentLoaded", init);
