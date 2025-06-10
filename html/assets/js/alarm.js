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
let alarmTime, isAlarmSet,
ringtone = new Audio("assets/Alarm files/ringtone.mp3");
for (let i = 12; i > 0; i--) {
    i = i < 10 ? `0${i}` : i;
    let option = `<option value="${i}">${i}</option>`;
    selectMenu[0].firstElementChild.insertAdjacentHTML("afterend", option);
}
for (let i = 59; i >= 0; i--) {
    i = i < 10 ? `0${i}` : i;
    let option = `<option value="${i}">${i}</option>`;
    selectMenu[1].firstElementChild.insertAdjacentHTML("afterend", option);
}
for (let i = 2; i > 0; i--) {
    let ampm = i == 1 ? "AM" : "PM";
    let option = `<option value="${ampm}">${ampm}</option>`;
    selectMenu[2].firstElementChild.insertAdjacentHTML("afterend", option);
}
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
            if (!ringtone) {
                ringtone = new Audio(`assets/Alarm files/${alarm.sound}`);
                ringtone.loop = true;
                ringtone.play();
                stopAlarmBtn.classList.remove("hidden"); // Show the stop button

                // Fetch user email from Firestore
                const userId = sessionStorage.getItem("userId");
                if (userId) {
                    const userDocRef = doc(db, "users", userId);
                    const userSnapshot = await getDoc(userDocRef);

                    if (userSnapshot.exists()) {
                        const userEmail = userSnapshot.data().email;
                        sendEmailNotification(userEmail, alarm.time); // Send email notification
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
    let time = `${hourSelect.value}:${minuteSelect.value} ${ampmSelect.value}`;
    let sound = soundSelect.value;
    let description = document.getElementById("alarm-description-input").value.trim();

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
        description: description,
        createdAt: new Date().toISOString()
    };

    try {
        const userDocRef = doc(db, "users", userId);
        const alarmCollectionRef = collection(userDocRef, "alarm");
        const docRef = await addDoc(alarmCollectionRef, alarmDoc);

        alarms.push({ id: docRef.id, ...alarmDoc }); // Add to local array with ID
        displayAlarms(); // Update UI
        alert("Alarm set successfully!");
        document.getElementById("alarm-description-input").value = "";
    } catch (error) {
        console.error("Error setting alarm:", error);
    }
}

// Display alarms with description
function displayAlarms() {
    const alarmsList = document.getElementById("alarms-list");
    alarmsList.innerHTML = "";
    alarms.forEach(alarm => {
        const alarmDiv = document.createElement("div");
        alarmDiv.className = "alarm-list-item";
        alarmDiv.innerHTML = `
            <div class="alarm-list-time">${alarm.time}</div>
            <div class="alarm-list-desc">${alarm.description ? alarm.description : "<em>No description</em>"}</div>
            <div class="alarm-list-sound">🔔 ${alarm.sound.replace('.mp3','')}</div>
            <button class="delete-alarm-btn" data-id="${alarm.id}">Delete</button>
        `;
        alarmsList.appendChild(alarmDiv);
    });
    document.querySelectorAll('.delete-alarm-btn').forEach(btn => {
        btn.onclick = async (e) => {
            const id = btn.getAttribute('data-id');
            const userId = sessionStorage.getItem("userId");
            if (!userId) return;
            const userDocRef = doc(db, "users", userId);
            const alarmDocRef = doc(userDocRef, "alarm", id);
            await deleteDoc(alarmDocRef);
            alarms = alarms.filter(a => a.id !== id);
            displayAlarms();
        };
    });
}

// Stop the alarm
function stopAlarm() {
    if (ringtone) {
        ringtone.pause();
        content.classList.remove("disable");
        setAlarmBtn.innerText = "Set Alarm";
        return isAlarmSet = false;
    }
    let time = `${selectMenu[0].value}:${selectMenu[1].value} ${selectMenu[2].value}`;
    if (time.includes("Hour") || time.includes("Minute") || time.includes("AM/PM")) {
        return alert("Please, select a valid time to set Alarm!");
    }
    alarmTime = time;
    isAlarmSet = true;
    content.classList.add("disable");
    setAlarmBtn.innerText = "Clear Alarm";
}
setAlarmBtn.addEventListener("click", setAlarm);
stopAlarmBtn.addEventListener("click", stopAlarm);

// Fetch alarms on page load
window.addEventListener("load", fetchAlarms);