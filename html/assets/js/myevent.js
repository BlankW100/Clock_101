import { getApps, initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    deleteDoc,
    doc,
    updateDoc,
    getDoc,
    arrayUnion
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBiOkxZFBwCP3NOXqZqpit5tF9MnwKaavQ",
    authDomain: "clock-101-10e68.firebaseapp.com",
    projectId: "clock-101-10e68",
    storageBucket: "clock-101-10e68.firebasestorage.app",
    messagingSenderId: "654434052980",
    appId: "1:654434052980:web:d270879ef90c796a059a21"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let editingEventId = null;
const notifiedEvents = new Set();

// Get current user's email
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.currentUserEmail = user.email;
        console.log("Logged in as:", user.email);
    } else {
        window.currentUserEmail = null;
        console.log("No user logged in");
    }
});

// Helper: get eventId from URL
function getEventIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("eventId");
}

// Helper: format countdown
function getCountdownString(eventDate) {
    const now = new Date().getTime();
    const eventTime = new Date(eventDate).getTime();
    const timeLeft = eventTime - now;

    if (timeLeft <= 0) return "Event has started!";

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return `Arrives in: ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
}

// EmailJS notification
function sendEmailWhenEventEnds(eventName, userEmail) {
    emailjs.send("service_nereuyw", "template_m05yqxb", {
        event_name: eventName,
        user_email: userEmail
    })
    .then((response) => {
        console.log("Email sent!", response.status, response.text);
    }, (error) => {
        console.error("Failed to send email:", error);
    });
}

// Add current user to event's email list
async function addCurrentUserToEvent(eventId) {
    const userEmail = window.currentUserEmail;
    if (!userEmail) return;
    const eventRef = doc(db, "events", eventId);
    await updateDoc(eventRef, {
        emails: arrayUnion(userEmail)
    });
}

// Save or update event
async function saveEvent() {
    const eventName = document.getElementById("eventName").value;
    const eventDate = document.getElementById("eventDate").value;
    const userEmail = window.currentUserEmail;

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
        const docRef = await addDoc(collection(db, "events"), {
            name: eventName,
            date: eventDate,
            emails: [userEmail]
        });
        alert("Event Saved!");
    }
    document.getElementById("eventName").value = "";
    document.getElementById("eventDate").value = "";
}

// Render events
function renderEvents(events) {
    const eventsList = document.getElementById("events-list");
    eventsList.innerHTML = "";

    events.forEach(event => {
        const eventDiv = document.createElement("div");
        eventDiv.className = "event-item";
        // Generate the share link for this event
        const shareLink = `${window.location.origin}${window.location.pathname}?eventId=${event.id}`;
        eventDiv.innerHTML = `
            <h3>${event.name}</h3>
            <div class="event-countdown" data-date="${event.date}" data-name="${event.name}" data-emails='${JSON.stringify(event.emails || [])}'></div>
            <div class="share-link" style="margin: 10px 0;">
                <input type="text" value="${shareLink}" readonly style="width:98%"> 
                <button onclick="navigator.clipboard.writeText('${shareLink}')">Copy Link</button>
            </div>
            ${event.emails && event.emails.includes(window.currentUserEmail) ? `
                <button class="edit-btn" data-id="${event.id}">Edit</button>
                <button class="delete-btn" data-id="${event.id}">Delete</button>
            ` : ""}
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
}

// Update countdowns and send notifications
function updateAllCountdowns(events = []) {
    const countdownDivs = document.querySelectorAll(".event-countdown");
    countdownDivs.forEach((div, idx) => {
        const date = div.getAttribute("data-date");
        const name = div.getAttribute("data-name");
        const emails = JSON.parse(div.getAttribute("data-emails") || "[]");
        const countdownStr = getCountdownString(date);
        div.textContent = countdownStr;

        // Use event ID for unique notification key
        const event = events[idx];
        const notifiedKey = event && event.id ? event.id : date + name;

        // Send to all emails saved with the event
        if (countdownStr === "Event has started!" && !notifiedEvents.has(notifiedKey)) {
            notifiedEvents.add(notifiedKey);
            if (emails && Array.isArray(emails)) {
                emails.forEach(email => {
                    sendEmailWhenEventEnds(name, email);
                });
            } else {
                // fallback: send to current user
                const userEmail = window.currentUserEmail || "user@example.com";
                sendEmailWhenEventEnds(name, userEmail);
            }
        }
    });
}

// Firestore listener
const eventId = getEventIdFromUrl();

onAuthStateChanged(auth, (user) => {
    if (user) {
        window.currentUserEmail = user.email;
        console.log("Logged in as:", user.email);

        if (eventId) {
            addCurrentUserToEvent(eventId);
            getDoc(doc(db, "events", eventId)).then(docSnap => {
                if (docSnap.exists()) {
                    const eventData = docSnap.data();
                    eventData.id = eventId;
                    renderEvents([eventData]);
                    if (window._countdownInterval) clearInterval(window._countdownInterval);
                    window._countdownInterval = setInterval(() => updateAllCountdowns([eventData]), 1000);
                } else {
                    document.getElementById("events-list").innerHTML = "<p>Event not found.</p>";
                }
            });
        } else {
            // Show all events for logged-in user
            const q = query(collection(db, "events"), orderBy("date"));
            onSnapshot(q, (snapshot) => {
                const events = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    data.id = doc.id;
                    events.push(data);
                });
                renderEvents(events);
                if (window._countdownInterval) clearInterval(window._countdownInterval);
                window._countdownInterval = setInterval(() => updateAllCountdowns(events), 1000);
            });
        }
    } else {
        // Not logged in, redirect to login page
        alert("Please log in to join this event and receive notifications.");
        window.location.href = "login.html";
    }
});

// DOM events
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("saveEventBtn").addEventListener("click", saveEvent);

    // Logout button handler
    const signoutBtn = document.getElementById("signout-link");
    if (signoutBtn) {
        signoutBtn.addEventListener("click", () => {
            signOut(auth).then(() => {
                window.location.href = "login.html";
            });
        });
    }
});
