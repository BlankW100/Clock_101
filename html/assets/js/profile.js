import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import moment from "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.43/moment-timezone-with-data.min.js";

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

// Fetch user preferences
const fetchUserPreferences = async () => {
  const userId = sessionStorage.getItem("userId");
  if (!userId) {
    console.error("No userId found in sessionStorage!");
    window.location.href = "login.html";
    return;
  }

  try {
    const userDoc = doc(db, "users", userId);
    const userSnapshot = await getDoc(userDoc);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      document.getElementById("timezone-search").value = userData.timezone || "";
      document.getElementById("theme-mode").value = userData.themeMode || "light";
    } else {
      console.error("No such user document! Creating a new one...");
      await setDoc(userDoc, { timezone: "", themeMode: "light" }); // Default values
    }
  } catch (error) {
    console.error("Error fetching user preferences:", error);
  }
};

// Update user preferences
const updateUserPreferences = async (event) => {
  event.preventDefault();

  const userId = sessionStorage.getItem("userId");
  const timezone = document.getElementById("timezone-search").value;
  const themeMode = document.getElementById("theme-mode").value;

  if (!userId) {
    console.error("No userId found in sessionStorage!");
    window.location.href = "login.html";
    return;
  }

  try {
    const userDoc = doc(db, "users", userId);
    await updateDoc(userDoc, {
      timezone: timezone,
      themeMode: themeMode,
    });

    alert("Preferences updated successfully!");
  } catch (error) {
    console.error("Error updating user preferences:", error);
    alert("Failed to update preferences. Please try again.");
  }
};

// Populate timezone list dynamically
const timezones = moment.tz.names();
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

// Add event listeners
window.addEventListener("load", () => {
  fetchUserPreferences();
  populateTimezoneList(); // Populate the full list on page load

  const timezoneSearchInput = document.getElementById("timezone-search");
  if (timezoneSearchInput) {
    timezoneSearchInput.addEventListener("input", handleTimezoneSearch);
  }

  document.getElementById("profile-form").addEventListener("submit", updateUserPreferences);
});

// Logout functionality
const signoutLink = document.getElementById("signout-link");
signoutLink.addEventListener("click", () => {
  sessionStorage.removeItem("userId");
  window.location.href = "login.html";
});