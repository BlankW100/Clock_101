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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM elements
const hourSelect = document.getElementById("hour-select");
const minuteSelect = document.getElementById("minute-select");
const ampmSelect = document.getElementById("ampm-select");
const ringtoneSelect = document.getElementById("ringtone-select");
const setAlarmBtn = document.getElementById("set-alarm-btn");
const stopAlarmBtn = document.getElementById("stop-alarm-btn");
const alarmsListDiv = document.getElementById("alarms-list");
const liveTimeElement = document.getElementById("live-time");
const alarmLabelInput = document.getElementById("alarm-label-input");

// State
let alarms = [];
let currentRingtone = null;

// Populate select menus
for (let i = 1; i <= 12; i++) {
    let val = i < 10 ? `0${i}` : `${i}`;
    hourSelect.insertAdjacentHTML("beforeend", `<option value="${val}">${val}</option>`);
}
for (let i = 0; i < 60; i++) {
    let val = i < 10 ? `0${i}` : `${i}`;
    minuteSelect.insertAdjacentHTML("beforeend", `<option value="${val}">${val}</option>`);
}
["AM", "PM"].forEach(ampm => {
    ampmSelect.insertAdjacentHTML("beforeend", `<option value="${ampm}">${ampm}</option>`);
});

// Live clock
setInterval(() => {
    const now = new Date();
    const hours = String(now.getHours() % 12 || 12).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const ampm = now.getHours() >= 12 ? "PM" : "AM";
    liveTimeElement.textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
}, 1000);

// Check alarms every second
setInterval(checkAlarms, 1000);

function checkAlarms() {
    const now = new Date();
    let h = now.getHours();
    let m = now.getMinutes();
    let ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    const timeStr = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
    alarms.forEach(alarm => {
        if (alarm.time === timeStr && !alarm.triggered) {
            playRingtone(alarm.sound || "ringtone.mp3");
            alarm.triggered = true;
            stopAlarmBtn.classList.remove("hidden");
            if (alarm.label) {
                alert(`Alarm: ${alarm.label}`);
            }
        }
    });
}

function playRingtone(filename) {
    stopRingtone();
    currentRingtone = new Audio(`assets/Alarm files/${filename}`);
    currentRingtone.loop = true;
    currentRingtone.play();
}

function stopRingtone() {
    if (currentRingtone) {
        currentRingtone.pause();
        currentRingtone.currentTime = 0;
        currentRingtone = null;
    }
    stopAlarmBtn.classList.add("hidden");
    alarms.forEach(alarm => alarm.triggered = false);
}

// Set a new alarm
async function setAlarm() {
    const hour = hourSelect.value;
    const minute = minuteSelect.value;
    const ampm = ampmSelect.value;
    const sound = ringtoneSelect.value;
    const label = alarmLabelInput.value.trim();

    if (hour === "Hour" || minute === "Minute" || ampm === "AM/PM") {
        alert("Please select a valid time to set Alarm!");
        return;
    }

    const time = `${hour}:${minute} ${ampm}`;
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
        alert("User not logged in!");
        return;
    }

    const alarmDoc = {
        time,
        sound,
        label,
        createdAt: new Date().toISOString()
    };

    try {
        const userDocRef = doc(db, "users", userId);
        const alarmCollectionRef = collection(userDocRef, "alarm");
        await addDoc(alarmCollectionRef, alarmDoc);
        await fetchAlarms();
        alarmLabelInput.value = ""; // Clear label input
        alert("Alarm set successfully!");
    } catch (error) {
        console.error("Error setting alarm:", error);
    }
}

// Display alarms in the UI
function displayAlarms() {
    alarmsListDiv.innerHTML = "";
    if (alarms.length === 0) {
        alarmsListDiv.innerHTML = "<div>No alarms set.</div>";
        return;
    }
    alarms.forEach(alarm => {
        const div = document.createElement("div");
        div.className = "alarm-item";
        div.innerHTML = `
            <span class="alarm-time">${alarm.time}</span>
            <span class="alarm-label">${alarm.label ? alarm.label : ""}</span>
            <span style="margin-left:10px;">🔔 ${alarm.sound.replace(".mp3", "").replace(/^\w/, c => c.toUpperCase())}</span>
            <span class="alarm-controls">
                <button data-id="${alarm.id}" class="delete-alarm-btn" title="Delete">🗑️</button>
            </span>
        `;
        alarmsListDiv.appendChild(div);
    });
    // Add delete listeners
    document.querySelectorAll(".delete-alarm-btn").forEach(btn => {
        btn.onclick = async function() {
            const id = this.getAttribute("data-id");
            await deleteAlarm(id);
        };
    });
}

// Delete alarm
async function deleteAlarm(id) {
    const userId = sessionStorage.getItem("userId");
    if (!userId) return;
    const userDocRef = doc(db, "users", userId);
    const alarmCollectionRef = collection(userDocRef, "alarm");
    try {
        await deleteDoc(doc(alarmCollectionRef, id));
        alarms = alarms.filter(a => a.id !== id);
        displayAlarms();
    } catch (e) {
        console.error("Failed to delete alarm:", e);
    }
}

// Fetch alarms from Firestore
async function fetchAlarms() {
    const userId = sessionStorage.getItem("userId");
    if (!userId) return;
    const userDocRef = doc(db, "users", userId);
    const alarmCollectionRef = collection(userDocRef, "alarm");
    const snapshot = await getDocs(alarmCollectionRef);
    alarms = [];
    snapshot.forEach(docSnap => {
        alarms.push({ id: docSnap.id, ...docSnap.data(), triggered: false });
    });
    displayAlarms();
}

// Event listeners
setAlarmBtn.addEventListener("click", setAlarm);
stopAlarmBtn.addEventListener("click", stopRingtone);
window.addEventListener("load", fetchAlarms);