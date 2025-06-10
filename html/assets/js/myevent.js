import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    doc,
    getDoc,
    updateDoc,
    arrayUnion,
    onSnapshot,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

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

// --- Get current user's email automatically --- NEW
const auth = getAuth(app);
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
                    if (window._countdownInterval) {
                        clearInterval(window._countdownInterval);
                    }
                    window._countdownInterval = setInterval(() => updateAllCountdowns([eventData]), 1000);
                } else {
                    document.getElementById("events-list").innerHTML = "<p>Event not found.</p>";
                }
            });
        }
    } else {
        window.currentUserEmail = null;
        console.log("No user logged in");
        if (eventId) {
            alert("Please log in to join this event and receive notifications.");
            window.location.href = "login.html";
        }
    }
});

// --- EmailJS Notification Function ---
function sendNoReplyEmail(userEmail, eventName) {
    emailjs.send("service_nereuyw", "template_m05yqxb", {
        to_email: userEmail,
        message: `Your event "${eventName}" has started!`
    })
    .then(function(response) {
        console.log("SUCCESS", response.status, response.text);
    }, function(error) {
        console.log("FAILED", error);
    });
}

// --- Alternative: Send email with different template variables ---
function sendEmailWhenEventEnds(eventName, userEmail) {
    emailjs.send("service_nereuyw", "template_m05yqxb", {
        event_name: eventName,
        user_email: userEmail // This must match the "To" field in your EmailJS template
    })
    .then((response) => {
        console.log("Email sent!", response.status, response.text);
        }, (error) => {
            console.error("Failed to send email:", error);
        });
    }

// --- Add current user to event's email list ---NEW
async function addCurrentUserToEvent(eventId) {
    const userEmail = window.currentUserEmail;
    if (!userEmail) return;
    const eventRef = doc(db, "events", eventId);
    await updateDoc(eventRef, {
        emails: arrayUnion(userEmail)
    });
}

// --- Helper to get eventId from URL --- NEW
function getEventIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("eventId");
}

// --- Save Event --- NEW
async function saveEvent() {
    const eventName = document.getElementById("eventName").value; // Get event name from input field
    const eventDate = document.getElementById("eventDate").value; // Get event date (local time) from input field
    const userEmail = window.currentUserEmail; // Get current user's email (set globally after login)

    if (!eventName || !eventDate) return alert("Please enter both fields!");

    // Convert the local date/time to a UTC string for timezone consistency
    const eventDateUTC = new Date(eventDate).toISOString();

    // Add a new document to the "events" collection in Firestore
    // The document contains the event name, UTC date, and an array with the creator's email
    const docRef = await addDoc(collection(db, "events"), {
        name: eventName,
        date: eventDateUTC, // Save as UTC
        emails: [userEmail]
    });

    // Generate a link using the new event's document ID--- NEW
    const shareLink = `${window.location.origin}${window.location.pathname}?eventId=${docRef.id}`;
    // Display the link on the page so the user can copy and share it
    document.getElementById("share-link").innerHTML = ` 
        <p>Share this link with your friend:</p>
        <input type="text" value="${shareLink}" readonly style="width:90%">
        <button onclick="navigator.clipboard.writeText('${shareLink}')">Copy Link</button>
    `;

    // Clear the input fields after saving
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

// --- Render Events --- NEW
function renderEvents(events) {
    const eventsList = document.getElementById("events-list");
    eventsList.innerHTML = "";

    events.forEach(event => {
        const eventDiv = document.createElement("div");
        eventDiv.className = "event-item";
        eventDiv.innerHTML = `
            <h3>${event.name}</h3>
            <div class="event-countdown" data-date="${event.date}" data-name="${event.name}" data-emails='${JSON.stringify(event.emails || [])}'></div>
        `;
        // Add the event div to the events list container in the DOM
        eventsList.appendChild(eventDiv);
    });
}

// --- Email Notification Logic --- NEW
const notifiedEvents = new Set(); // Create a Set to keep track of which events have already sent notifications

function updateAllCountdowns(events = []) {
    const countdownDivs = document.querySelectorAll(".event-countdown");
    countdownDivs.forEach((div, idx) => {
        const date = div.getAttribute("data-date");
        const name = div.getAttribute("data-name");
        const emails = JSON.parse(div.getAttribute("data-emails") || "[]");
        const countdownStr = getCountdownString(date);
        div.textContent = countdownStr;

        // --- Use event ID for unique notification key ---
        const event = events[idx];
        const notifiedKey = (event && event.id ? event.id : "") + date + name;

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

// --- Firestore Listener (show only shared event if eventId in URL) --- NEW
const eventId = getEventIdFromUrl();

if (eventId) {
    // Add current user to event's email list
    onAuthStateChanged(auth, (user) => {
        if (user) {
            addCurrentUserToEvent(eventId);
            getDoc(doc(db, "events", eventId)).then(docSnap => {
                if (docSnap.exists()) {
                    const eventData = docSnap.data();
                    eventData.id = eventId;
                    renderEvents([eventData]);
                    if (window._countdownInterval) {
                        clearInterval(window._countdownInterval);
                    }
                    window._countdownInterval = setInterval(() => updateAllCountdowns([eventData]), 1000);
                } else {
                    document.getElementById("events-list").innerHTML = "<p>Event not found.</p>";
                }
            });
        } else {
            // Not logged in: redirect to login page or show a message
            alert("Please log in to join this event and receive notifications.");
            window.location.href = "login.html"; // Change to your login page path
        }
    });
} else {
    // Show all events as before
    const q = query(collection(db, "events"), orderBy("date"));
    onSnapshot(q, (snapshot) => {
        const events = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            data.id = doc.id;
            events.push(data);
        });
        renderEvents(events);
        // --- Clear previous interval before setting a new one ---
        if (window._countdownInterval) {
            clearInterval(window._countdownInterval);
        }
        window._countdownInterval = setInterval(() => updateAllCountdowns(events), 1000);
    });
}

// --- DOM Events --- NEW
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("saveEventBtn").addEventListener("click", saveEvent);

    // --- Logout button handler ---
    const signoutBtn = document.getElementById("signout-link");
    if (signoutBtn) {
        signoutBtn.addEventListener("click", () => {
            const auth = getAuth();
            signOut(auth).then(() => {
                window.location.href = "login.html"; // Redirect to your login page
            });
        });
    }
});
