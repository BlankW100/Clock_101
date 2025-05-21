import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, doc, collection, addDoc, getDocs, deleteDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

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
content = document.querySelector(".content"),
selectMenu = document.querySelectorAll("select"),
setAlarmBtn = document.querySelector("button");

// --- Fix: define alarms and stopAlarmBtn ---
let alarms = [];
let alarmTime, isAlarmSet,
ringtone = new Audio("assets/Alarm files/ringtone.mp3");

// Create and append stopAlarmBtn
const stopAlarmBtn = document.createElement("button");
stopAlarmBtn.textContent = "Stop Alarm";
stopAlarmBtn.className = "hidden";
stopAlarmBtn.style.marginTop = "20px";
content.parentNode.appendChild(stopAlarmBtn);

// Populate select menus
for (let i = 12; i > 0; i--) {
    let val = i < 10 ? `0${i}` : i;
    let option = `<option value="${val}">${val}</option>`;
    selectMenu[0].firstElementChild.insertAdjacentHTML("afterend", option);
}
for (let i = 59; i >= 0; i--) {
    let val = i < 10 ? `0${i}` : i;
    let option = `<option value="${val}">${val}</option>`;
    selectMenu[1].firstElementChild.insertAdjacentHTML("afterend", option);
}
for (let i = 2; i > 0; i--) {
    let ampm = i == 1 ? "AM" : "PM";
    let option = `<option value="${ampm}">${ampm}</option>`;
    selectMenu[2].firstElementChild.insertAdjacentHTML("afterend", option);
}

// Live clock and alarm check
setInterval(() => {
    let date = new Date(),
    h = date.getHours(),
    m = date.getMinutes(),
    s = date.getSeconds(),
    ampm = "AM";
    if(h >= 12) {
        h = h - 12;
        ampm = "PM";
    }
    h = h == 0 ? h = 12 : h;
    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;
    currentTime.textContent = `${h}:${m}:${s} ${ampm}`;

    // Check if any alarm matches the current time
    alarms.forEach(async alarm => {
        if (alarm.time === `${h}:${m} ${ampm}`) {
            if (ringtone.paused) {
                ringtone = new Audio(`assets/Alarm files/${alarm.sound || "ringtone.mp3"}`);
                ringtone.loop = true;
                ringtone.play();
                stopAlarmBtn.classList.remove("hidden");
                stopAlarmBtn.style.display = "block";

                // Fetch user email from Firestore
                const userId = sessionStorage.getItem("userId");
                if (userId) {
                    const userDocRef = doc(db, "users", userId);
                    const userSnapshot = await getDoc(userDocRef);

                    if (userSnapshot.exists()) {
                        const userEmail = userSnapshot.data().email;
                        sendEmailNotification(userEmail, alarm.time);
                    } else {
                        console.error("User document does not exist");
                    }
                }
            }
        }
    });
}, 1000);

// Send email notification
async function sendEmailNotification(email, alarmTime) {
    try {
        const response = await fetch("https://<your-cloud-function-url>/sendAlarmNotification", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, alarmTime })
        });

        if (!response.ok) {
            throw new Error("Failed to send email notification");
        }

        console.log("Email notification sent successfully");
    } catch (error) {
        console.error("Error sending email notification:", error);
    }
}

// Set a new alarm
async function setAlarm() {
    const hourSelect = selectMenu[0];
    const minuteSelect = selectMenu[1];
    const ampmSelect = selectMenu[2];
    const soundSelect = { value: "ringtone.mp3" }; // Default sound, adjust if you have a sound selector

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

        alarms.push({ id: docRef.id, ...alarmDoc });
        displayAlarms();
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
        stopAlarmBtn.classList.add("hidden");
        stopAlarmBtn.style.display = "none";
        content.classList.remove("disable");
        setAlarmBtn.innerText = "Set Alarm";
        isAlarmSet = false;
    }
}

// Display alarms (placeholder, implement as needed)
function displayAlarms() {
    // You can implement alarm list UI here if needed
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
        alarms.push({ id: docSnap.id, ...docSnap.data() });
    });
    displayAlarms();
}

// Event listeners
setAlarmBtn.addEventListener("click", setAlarm);
stopAlarmBtn.addEventListener("click", stopAlarm);
window.addEventListener("load", fetchAlarms);