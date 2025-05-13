import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js"; // Correct import

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
form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Inputs
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  console.log("Login attempt with email:", email); // Debugging log

  signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      console.log("Login successful:", userCredential); // Debugging log

      const ref = doc(db, "users", userCredential.user.uid);
      const docSnap = await getDoc(ref);

      if (docSnap.exists()) {
        console.log("User document found:", docSnap.data()); // Debugging log

        sessionStorage.setItem(
          "user",
          JSON.stringify({
            email: docSnap.data().email,
            password: docSnap.data().password,
          })
        );
        sessionStorage.setItem("userId", JSON.stringify(userCredential.user.uid));
        alert("Login successful!");
        window.location.href = "index.html"; // Redirect to index.html on successful login
      } else {
        console.error("No user document found in Firestore."); // Debugging log
        alert("No user document found in Firestore.");
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      console.error("Login error:", errorCode, errorMessage); // Debugging log

      // Friendly error messages
      if (errorCode === "auth/user-not-found") {
        alert("No user found with this email. Please sign up first.");
      } else if (errorCode === "auth/wrong-password") {
        alert("Incorrect password. Please try again.");
      } else if (errorCode === "auth/invalid-email") {
        alert("Invalid email format. Please enter a valid email.");
      } else {
        alert(`Error: ${errorMessage}`);
      }
    });
});

// Forgot Password feature
const forgotPasswordLink = document.getElementById("forgot-password");
forgotPasswordLink.addEventListener("click", function (event) {
  event.preventDefault();
  window.location.href = "forgot-password.html"; // Redirect to forgot-password.html
});