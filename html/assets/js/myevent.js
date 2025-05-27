import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Initialize Firebase (for Firestore)
const firebaseConfig = {
    apiKey: "AIzaSyBiOkxZFBwCP3NOXqZqpit5tF9MnwKaavQ",
    authDomain: "clock-101-10e68.firebaseapp.com",
    projectId: "clock-101-10e68",
    storageBucket: "clock-101-10e68.firebasestorage.app",
    messagingSenderId: "654434052980",
    appId: "1:654434052980:web:d270879ef90c796a059a21"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- 1. Set your email globally so it is always used ---
window.currentUserEmail = "weier0816@gmail.com";

// --- EmailJS Notification Function ---
function sendNoReplyEmail(userEmail, eventName) {
    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
        to_email: userEmail,
        message: `Your event "${eventName}" has started!`
    })
    .then(function(response) {
        console.log("SUCCESS", response.status, response.text);
    }, function(error) {
        console.log("FAILED", error);
    });
}

// --- Save Event ---
async function saveEvent() {
    const eventName = document.getElementById("eventName").value;
    const eventDate = document.getElementById("eventDate").value;

    if (!eventName || !eventDate) return alert("Please enter both fields!");

    await addDoc(collection(db, "events"), {
        name: eventName,
        date: eventDate
    });

    alert("Event Saved!");
    document.getElementById("eventName").value = "";
    document.getElementById("eventDate").value = "";
}

// --- Countdown Helper ---
function getCountdownString(eventDate) {
    const now = new Date().getTime();
    const eventTime = new Date(eventDate).getTime();
    const timeLeft = eventTime - now;

    if (timeLeft <= 0) {
        return "Event has started!";
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % 60000) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

// --- Render Events ---
function renderEvents(events) {
    const eventsList = document.getElementById("events-list");
    eventsList.innerHTML = "";

    events.forEach(event => {
        const eventDiv = document.createElement("div");
        eventDiv.className = "event-item";
        eventDiv.innerHTML = `
            <h3>${event.name}</h3>
            <div class="event-countdown" data-date="${event.date}" data-name="${event.name}"></div>
        `;
        eventsList.appendChild(eventDiv);
    });

    updateAllCountdowns(events);
}

// --- Email Notification Logic ---
const notifiedEvents = new Set();

function updateAllCountdowns(events = []) {
    const countdownDivs = document.querySelectorAll(".event-countdown");
    countdownDivs.forEach((div, idx) => {
        const date = div.getAttribute("data-date");
        const name = div.getAttribute("data-name");
        const countdownStr = getCountdownString(date);
        div.textContent = countdownStr;

        // --- 2. Add debug log to check which email will be used ---
        const userEmail = window.currentUserEmail || "user@example.com";
        // --- 3. Only send if not already notified and event has started ---
        if (countdownStr === "Event has started!" && !notifiedEvents.has(date + name)) {
            notifiedEvents.add(date + name);
            console.log("Sending email to:", userEmail);

            // --- Use EmailJS for notification ---
            sendNoReplyEmail(userEmail, name);
        }
    });
}

// --- Firestore Listener ---
const q = query(collection(db, "events"), orderBy("date"));
onSnapshot(q, (snapshot) => {
    const events = [];
    snapshot.forEach(doc => {
        events.push(doc.data());
    });
    renderEvents(events);
    // Start interval for updating countdowns only once
    if (!window._countdownInterval) {
        window._countdownInterval = setInterval(() => updateAllCountdowns(events), 1000);
    }
});

// --- DOM Events ---
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("saveEventBtn").addEventListener("click", saveEvent);
});