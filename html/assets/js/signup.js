import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// Your web app's Firebase configuration
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
const analytics = getAnalytics(app);
const auth = getAuth(app); // Initialize auth

// Form submission
const form = document.querySelector(".auth-form"); // Select the form
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form from reloading the page

  // Inputs
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      alert("Account created successfully!");
      window.location.href = "login.html"; // Redirect to login page
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert(`Error: ${errorMessage}`); // Display the actual error message
    });
});