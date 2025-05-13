import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

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
const db = getFirestore(app); // Initialize Firestore

// Login form submission
const form = document.querySelector(".auth-form");
form.addEventListener("submit", async function (event) {
  event.preventDefault();

  // Inputs
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  console.log("Login attempt with email:", email); // Debugging log

  try {
    // Sign in the user with Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;

    // Store the user ID in sessionStorage for the session
    sessionStorage.setItem("userId", userId);

    // Retrieve the user's document from Firestore
    const ref = doc(db, "users", userId);
    const docSnap = await getDoc(ref);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      const hashedPassword = userData.password; // Retrieve the hashed password from Firestore

      // Compare the plain text password with the hashed password
      const isPasswordValid = await bcrypt.compare(password, hashedPassword);

      if (isPasswordValid) {
        // Store additional user data in sessionStorage if needed
        sessionStorage.setItem("username", userData.username);
        sessionStorage.setItem("email", userData.email);

        alert("Login successful!");
        window.location.href = "index.html"; // Redirect to the homepage
      } else {
        alert("Invalid password. Please try again.");
      }
    } else {
      alert("No user document found in Firestore.");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert(`Error: ${error.message}`);
  }
});

// Forgot Password feature
const forgotPasswordLink = document.getElementById("forgot-password");
forgotPasswordLink.addEventListener("click", function (event) {
  event.preventDefault();
  window.location.href = "forgot-password.html"; // Redirect to forgot-password.html
});