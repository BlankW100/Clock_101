import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

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

// Form submission
const form = document.querySelector(".auth-form"); // Select the form
form.addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent form from reloading the page

  // Inputs
  const email = document.getElementById("email").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    // Hash the password using bcrypt.js
    const hashedPassword = window.bcrypt.hashSync(password, 10); // 10 is the salt rounds

    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;

    console.log("Creating Firestore document for userId:", userId); // Debugging log

    // Save user data (with hashed password) in Firestore
    const ref = doc(db, "users", userId); // Reference to Firestore document
    await setDoc(ref, {
      email: email,
      username: username, // Save the username in Firestore
      password: hashedPassword, // Save the hashed password
    });

    // Signed up
    alert("Account created successfully!");
    window.location.href = "login.html"; // Redirect to login page
  } catch (error) {
    const errorMessage = error.message;
    console.error("Signup error:", error); // Debugging log
    alert(`Error: ${errorMessage}`); // Display the actual error message
  }
});