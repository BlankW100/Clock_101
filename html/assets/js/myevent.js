import { db } from "./firebase-init.js";
import {
    collection,
    addDoc,
    getDocs,
    onSnapshot,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

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

// Helper to format countdown
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
    const seconds = Math.floor((timeLeft % 1000) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

// Render all events and their countdowns
function renderEvents(events) {
    const eventsList = document.getElementById("events-list");
    eventsList.innerHTML = "";

    events.forEach(event => {
        const eventDiv = document.createElement("div");
        eventDiv.className = "event-item";
        eventDiv.innerHTML = `
            <h3>${event.name}</h3>
            <div class="event-countdown" data-date="${event.date}"></div>
        `;
        eventsList.appendChild(eventDiv);
    });

    // Start countdowns for all events
    updateAllCountdowns();
}

function updateAllCountdowns() {
    const countdownDivs = document.querySelectorAll(".event-countdown");
    countdownDivs.forEach(div => {
        const date = div.getAttribute("data-date");
        div.textContent = getCountdownString(date);
    });
}

// Listen for changes in the events collection (real-time updates)
const q = query(collection(db, "events"), orderBy("date"));
onSnapshot(q, (snapshot) => {
    const events = [];
    snapshot.forEach(doc => {
        events.push(doc.data());
    });
    renderEvents(events);
    // Start interval for updating countdowns only once
    if (!window._countdownInterval) {
        window._countdownInterval = setInterval(updateAllCountdowns, 1000);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("saveEventBtn").addEventListener("click", saveEvent);
});