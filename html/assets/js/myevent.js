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

// --- Email Notification Setup (using compat SDK for Functions) ---
window.addEventListener("DOMContentLoaded", () => {
    // Load compat SDK for functions
    const scriptApp = document.createElement('script');
    scriptApp.src = "https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js";
    scriptApp.onload = () => {
        const scriptFunc = document.createElement('script');
        scriptFunc.src = "https://www.gstatic.com/firebasejs/8.10.1/firebase-functions.js";
        scriptFunc.onload = () => {
            // Initialize compat Firebase app if not already initialized
            if (!window.firebase.apps.length) {
                window.firebase.initializeApp(firebaseConfig);
            }
            window.functions = window.firebase.functions();
            window.sendAlarmEmail = window.functions.httpsCallable('sendAlarmEmail');
        };
        document.body.appendChild(scriptFunc);
    };
    document.body.appendChild(scriptApp);
});

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

        // If event has started and not notified yet, send email
        if (countdownStr === "Event has started!" && !notifiedEvents.has(date + name)) {
            notifiedEvents.add(date + name);
            // Replace this with the actual user's email
            const userEmail = window.currentUserEmail || "user@example.com";
            if (window.sendAlarmEmail) {
                window.sendAlarmEmail({
                    email: userEmail,
                    subject: "⏰ Time's up!",
                    message: `Your event "${name}" has started!`
                }).then(result => {
                    if (result.data.success) {
                        console.log("Email sent successfully!");
                    } else {
                        console.error("Email failed:", result.data.error);
                    }
                }).catch(err => {
                    console.error("Email send error:", err);
                });
            } else {
                console.warn("Email function not ready yet.");
            }
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