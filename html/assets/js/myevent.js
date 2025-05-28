import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    deleteDoc,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBiOkxZFBwCP3NOXqZqpit5tF9MnwKaavQ",
    authDomain: "clock-101-10e68.firebaseapp.com",
    projectId: "clock-101-10e68",
    storageBucket: "clock-101-10e68.firebasestorage.app",
    messagingSenderId: "654434052980",
    appId: "1:654434052980:web:d270879ef90c796a059a21"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let editingEventId = null;

async function saveEvent() {
    const eventName = document.getElementById("eventName").value;
    const eventDate = document.getElementById("eventDate").value;

    if (!eventName || !eventDate) return alert("Please enter both fields!");

    if (editingEventId) {
        // Update existing event
        const eventRef = doc(db, "events", editingEventId);
        await updateDoc(eventRef, {
            name: eventName,
            date: eventDate
        });
        editingEventId = null;
        document.getElementById("saveEventBtn").textContent = "Save Event";
        alert("Event updated!");
    } else {
        // Add new event
        await addDoc(collection(db, "events"), {
            name: eventName,
            date: eventDate
        });
        alert("Event Saved!");
    }
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
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return `Arrives in: ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
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
            <button class="edit-btn" data-id="${event.id}">Edit</button>
            <button class="delete-btn" data-id="${event.id}">Delete</button>
        `;
        eventsList.appendChild(eventDiv);
    });

    // Add event listeners for edit and delete
    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            const id = btn.getAttribute("data-id");
            const event = events.find(ev => ev.id === id);
            if (event) {
                document.getElementById("eventName").value = event.name;
                document.getElementById("eventDate").value = event.date;
                editingEventId = id;
                document.getElementById("saveEventBtn").textContent = "Update Event";
            }
        });
    });
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            const id = btn.getAttribute("data-id");
            if (confirm("Are you sure you want to delete this event?")) {
                await deleteDoc(doc(db, "events", id));
            }
        });
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
    snapshot.forEach(docSnap => {
        const data = docSnap.data();
        events.push({ ...data, id: docSnap.id });
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