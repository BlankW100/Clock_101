import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
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

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

let alarms = [];

document.addEventListener("DOMContentLoaded", () => {
    // Populate hour, minute, am/pm selects
    const hourSelect = document.getElementById("hour-select");
    const minuteSelect = document.getElementById("minute-select");
    const ampmSelect = document.getElementById("ampm-select");
    for (let i = 1; i <= 12; i++) {
        const val = i < 10 ? `0${i}` : `${i}`;
        hourSelect.insertAdjacentHTML("beforeend", `<option value="${val}">${val}</option>`);
    }
    for (let i = 0; i < 60; i++) {
        const val = i < 10 ? `0${i}` : `${i}`;
        minuteSelect.insertAdjacentHTML("beforeend", `<option value="${val}">${val}</option>`);
    }
    ["AM", "PM"].forEach(ampm => {
        ampmSelect.insertAdjacentHTML("beforeend", `<option value="${ampm}">${ampm}</option>`);
    });

    // Alarm logic
    const setAlarmBtn = document.getElementById("set-alarm-btn");
    const stopAlarmBtn = document.getElementById("stop-alarm-btn");
    const alarmsList = document.getElementById("alarms-list");
    let ringtone = new Audio("assets/Alarm files/ringtone.mp3");
    let isAlarmSet = false;

    setAlarmBtn.addEventListener("click", setAlarm);
    stopAlarmBtn.addEventListener("click", stopAlarm);

    function displayAlarms() {
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

    async function setAlarm() {
        const hour = hourSelect.value;
        const minute = minuteSelect.value;
        const ampm = ampmSelect.value;
        const sound = document.getElementById("ringtone-select").value;
        const description = document.getElementById("alarm-description-input").value.trim();
        if ([hour, minute, ampm].includes("Hour") || [hour, minute, ampm].includes("Minute") || [hour, minute, ampm].includes("AM/PM")) {
            return alert("Please select a valid time to set Alarm!");
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
            description,
            createdAt: new Date().toISOString()
        };
        try {
            const userDocRef = doc(db, "users", userId);
            const alarmCollectionRef = collection(userDocRef, "alarm");
            const docRef = await addDoc(alarmCollectionRef, alarmDoc);
            alarms.push({ id: docRef.id, ...alarmDoc });
            displayAlarms();
            alert("Alarm set successfully!");
            document.getElementById("alarm-description-input").value = "";
        } catch (error) {
            console.error("Error setting alarm:", error);
        }
    }

    function stopAlarm() {
        if (ringtone) {
            ringtone.pause();
            setAlarmBtn.innerText = "Set Alarm";
            isAlarmSet = false;
        }
    }

    // Fetch alarms from Firestore for the logged-in user
    async function fetchAlarms() {
        const userId = sessionStorage.getItem("userId");
        if (!userId) return;
        const userDocRef = doc(db, "users", userId);
        const alarmCollectionRef = collection(userDocRef, "alarm");
        try {
            const snapshot = await getDocs(alarmCollectionRef);
            alarms = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
            displayAlarms();
        } catch (error) {
            console.error("Error fetching alarms:", error);
        }
    }

    // Fetch alarms on page load
    fetchAlarms();
});