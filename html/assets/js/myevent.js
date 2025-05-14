import { db } from "./firebase-init.js";
import { ref, set, onValue } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";

function saveEvent() {
    const eventName = document.getElementById("eventName").value;
    const eventDate = document.getElementById("eventDate").value;

    if (!eventName || !eventDate) return alert("Please enter both fields!");

    set(ref(db, "events/" + eventName), {
        name: eventName,
        date: eventDate
    });

    alert("Event Saved!");
    startCountdown(eventDate);
}

function startCountdown(eventDate) {
    const countdownDiv = document.getElementById("countdown");

    function updateCountdown() {
        const now = new Date().getTime();
        const eventTime = new Date(eventDate).getTime();
        const timeLeft = eventTime - now;

        if (timeLeft <= 0) {
            countdownDiv.innerHTML = `<h2>Event has started!</h2>`;
            return;
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % 1000) / 1000);

        countdownDiv.innerHTML = `<h2>${days}d ${hours}h ${minutes}m ${seconds}s</h2>`;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

onValue(ref(db, "events"), (snapshot) => {
    snapshot.forEach((childSnapshot) => {
        const eventData = childSnapshot.val();
        startCountdown(eventData.date);
    });
});

window.saveEvent = saveEvent;

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBiOkxZFBwCP3NOXqZqpit5tF9MnwKaavQ",
    authDomain: "clock-101-10e68.firebaseapp.com",
    databaseURL: "https://clock-101-10e68-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "clock-101-10e68",
    storageBucket: "clock-101-10e68.firebasestorage.app",
    messagingSenderId: "654434052980",
    appId: "1:654434052980:web:d270879ef90c796a059a21"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);