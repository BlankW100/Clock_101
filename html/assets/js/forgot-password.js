import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

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
const auth = getAuth(app);

// Handle password reset form submission
const form = document.querySelector(".auth-form");
form.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;

    if (email) {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                alert("Password reset email sent! Please check your inbox.");
                window.location.href = "login.html"; // Redirect to login page
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                console.error("Password reset error:", errorCode, errorMessage);

                if (errorCode === "auth/user-not-found") {
                    alert("No user found with this email.");
                } else if (errorCode === "auth/invalid-email") {
                    alert("Invalid email format. Please enter a valid email.");
                } else {
                    alert(`Error: ${errorMessage}`);
                }
            });
    } else {
        alert("Please enter your email.");
    }
});