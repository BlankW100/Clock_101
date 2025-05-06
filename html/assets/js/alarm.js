import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, doc, collection, addDoc, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

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

const currentTime = document.querySelector("h1"),
    hourSelect = document.getElementById("hour-select"),
    minuteSelect = document.getElementById("minute-select"),
    ampmSelect = document.getElementById("ampm-select"),
    soundSelect = document.getElementById("sound-select"),
    setAlarmBtn = document.getElementById("set-alarm-btn"),
    stopAlarmBtn = document.getElementById("stop-alarm-btn"),
    alarmList = document.getElementById("alarm-list");

let alarms = []; // Local array to store alarms
let ringtone = null; // Global ringtone instance

// Populate hour, minute, and AM/PM dropdowns
for (let i = 12; i > 0; i--) {
    i = i < 10 ? `0${i}` : i;
    let option = `<option value="${i}">${i}</option>`;
    hourSelect.insertAdjacentHTML("beforeend", option);
}
for (let i = 59; i >= 0; i--) {
    i = i < 10 ? `0${i}` : i;
    let option = `<option value="${i}">${i}</option>`;
    minuteSelect.insertAdjacentHTML("beforeend", option);
}
["AM", "PM"].forEach(ampm => {
    let option = `<option value="${ampm}">${ampm}</option>`;
    ampmSelect.insertAdjacentHTML("beforeend", option);
});

// Update live time
setInterval(() => {
    let date = new Date(),
        h = date.getHours(),
        m = date.getMinutes(),
        s = date.getSeconds(),
        ampm = "AM";

    if (h >= 12) {
        h = h - 12;
        ampm = "PM";
    }
    h = h == 0 ? h = 12 : h;
    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;
    currentTime.textContent = `${h}:${m}:${s} ${ampm}`;

    // Check if any alarm matches the current time
    alarms.forEach(alarm => {
        if (alarm.time === `${h}:${m} ${ampm}`) {
            if (!ringtone) {
                ringtone = new Audio(`assets/Alarm files/${alarm.sound}`);
                ringtone.loop = true;
                ringtone.play();
                stopAlarmBtn.classList.remove("hidden"); // Show the stop button
            }
        }
    });
}, 1000);

// Set a new alarm
async function setAlarm() {
    let time = `${hourSelect.value}:${minuteSelect.value} ${ampmSelect.value}`;
    let sound = soundSelect.value;

    if (time.includes("Hour") || time.includes("Minute") || time.includes("AM/PM")) {
        return alert("Please select a valid time to set Alarm!");
    }

    // Save alarm to Firestore
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
        alert("User not logged in!");
        return;
    }

    const alarmDoc = {
        time: time,
        sound: sound,
        createdAt: new Date().toISOString()
    };

    try {
        const userDocRef = doc(db, "users", userId);
        const alarmCollectionRef = collection(userDocRef, "alarm");
        const docRef = await addDoc(alarmCollectionRef, alarmDoc);

        alarms.push({ id: docRef.id, ...alarmDoc }); // Add to local array with ID
        displayAlarms(); // Update UI
        alert("Alarm set successfully!");
    } catch (error) {
        console.error("Error setting alarm:", error);
    }
}

// Stop the alarm
function stopAlarm() {
    if (ringtone) {
        ringtone.pause();
        ringtone.currentTime = 0;
        ringtone = null;
        stopAlarmBtn.classList.add("hidden"); // Hide the stop button
    }
}

// Fetch alarms from Firestore
async function fetchAlarms() {
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
        alert("User not logged in!");
        return;
    }

    try {
        const userDocRef = doc(db, "users", userId);
        const alarmCollectionRef = collection(userDocRef, "alarm");
        const querySnapshot = await getDocs(alarmCollectionRef);

        alarms = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        displayAlarms(); // Update UI
    } catch (error) {
        console.error("Error fetching alarms:", error);
    }
}

// Display alarms in the UI
function displayAlarms() {
    alarmList.innerHTML = ""; // Clear the list
    alarms.forEach(alarm => {
        const listItem = document.createElement("li");
        listItem.textContent = `${alarm.time} - ${alarm.sound}`;
        listItem.className = "alarm-item";

        // Add delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.addEventListener("click", () => deleteAlarm(alarm.id)); // Pass the correct alarm ID

        listItem.appendChild(deleteBtn);
        alarmList.appendChild(listItem);
    });
}

// Delete an alarm
async function deleteAlarm(alarmId) {
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
        alert("User not logged in!");
        return;
    }

    try {
        const userDocRef = doc(db, "users", userId);
        const alarmDocRef = doc(userDocRef, "alarm", alarmId);
        await deleteDoc(alarmDocRef);

        alarms = alarms.filter(alarm => alarm.id !== alarmId); // Remove from local array
        displayAlarms(); // Update UI
        alert("Alarm deleted successfully!");
    } catch (error) {
        console.error("Error deleting alarm:", error);
    }
}

// Event listeners
setAlarmBtn.addEventListener("click", setAlarm);
stopAlarmBtn.addEventListener("click", stopAlarm);

// Fetch alarms on page load
window.addEventListener("load", fetchAlarms);