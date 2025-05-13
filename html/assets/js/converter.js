import { 
    populateTimezoneSelect,
    convertTimeBetweenTimezones,
    formatTimeForTimezone,
    formatDateForTimezone
  } from './timezone-utils.js';

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

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

// Fetch username from Firestore
const fetchUsername = async () => {
    const userId = sessionStorage.getItem("userId");
    if (userId) {
        try {
            const userDoc = doc(db, "users", userId);
            const userSnapshot = await getDoc(userDoc);
            if (userSnapshot.exists()) {
                const username = userSnapshot.data().username || "Guest";
                document.getElementById("username").textContent = username;
            } else {
                console.error("No such user document!");
                document.getElementById("username").textContent = "Guest";
            }
        } catch (error) {
            console.error("Error fetching username:", error);
            document.getElementById("username").textContent = "Guest";
        }
    } else {
        console.error("No userId found in sessionStorage!");
        document.getElementById("username").textContent = "Guest";
    }
};

// Check if user is logged in
const checkCredentials = () => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
        console.error("No userId found in sessionStorage. Redirecting to login.html...");
        window.location.href = "login.html";
    }
};

// Sign out function
const signout = () => {
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("user");
    window.location.href = "login.html";
};

// Add event listeners
document.getElementById("signout-link").addEventListener("click", signout);

// Call functions on page load
window.addEventListener("load", () => {
    checkCredentials();
    fetchUsername();
});

document.addEventListener('DOMContentLoaded', function() {
    const baseSelect = document.getElementById('base-timezone');
    const targetSelect = document.getElementById('target-timezone');
    const resultDiv = document.getElementById('conversion-result');
    
    // Initialize dropdowns
    populateTimezoneSelect(baseSelect, dayjs.tz.guess());
    populateTimezoneSelect(targetSelect, 'Europe/London');
    
    // Set up event listeners
    baseSelect.addEventListener('change', updateConversion);
    targetSelect.addEventListener('change', updateConversion);
    
    function updateConversion() {
      const fromTz = baseSelect.value;
      const toTz = targetSelect.value;
      const now = new Date();
      
      const convertedTime = convertTimeBetweenTimezones(now, fromTz, toTz);
      
      resultDiv.innerHTML = `
        <h3>${formatDateForTimezone(convertedTime, toTz)}</h3>
        <p class="time">${formatTimeForTimezone(convertedTime, toTz)}</p>
        <p class="timezone">${targetSelect.options[targetSelect.selectedIndex].text}</p>
      `;
    }
    
    // Initial conversion
    updateConversion();
});

// Elements for time conversion
const baseCitySelect = document.getElementById("base-city");
const targetCitySelect = document.getElementById("target-city");
const baseTimeElement = document.getElementById("base-time");
const baseDateElement = document.getElementById("base-date");
const convertedTimeElement = document.getElementById("converted-time");
const convertedDateElement = document.getElementById("converted-date");

// Update live base time
setInterval(() => {
    const now = moment();
    const hours = now.format("HH");
    const minutes = now.format("mm");
    const seconds = now.format("ss");
    const date = now.format("MMMM D, YYYY");

    baseTimeElement.textContent = `${hours}:${minutes}:${seconds}`;
    baseDateElement.textContent = date;

    updateConvertedTime();
}, 1000);

// Update converted time
function updateConvertedTime() {
    const baseCity = baseCitySelect.value;
    const targetCity = targetCitySelect.value;

    const now = moment.tz(baseCity);
    const converted = now.clone().tz(targetCity);

    convertedTimeElement.textContent = converted.format("HH:mm:ss");
    convertedDateElement.textContent = converted.format("MMMM D, YYYY");
}

// Event listeners for dropdown changes
baseCitySelect.addEventListener("change", updateConvertedTime);
targetCitySelect.addEventListener("change", updateConvertedTime);