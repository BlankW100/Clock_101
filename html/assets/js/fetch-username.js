import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

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
const db = getFirestore(app);

// Fetch username from Firestore
const fetchUsername = async () => {
  const userId = sessionStorage.getItem("userId");
  const usernameElement = document.getElementById("username");

  if (!userId) {
    console.error("No userId found in sessionStorage!");
    if (usernameElement) usernameElement.textContent = "Guest";
    return;
  }

  try {
    const userDoc = doc(db, "users", userId);
    const userSnapshot = await getDoc(userDoc);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      const username = userData.username || "Guest";
      if (usernameElement) usernameElement.textContent = username;
    } else {
      console.error("No such user document!");
      if (usernameElement) usernameElement.textContent = "Guest";
    }
  } catch (error) {
    console.error("Error fetching username:", error);
    if (usernameElement) usernameElement.textContent = "Guest";
  }
};

// Call fetchUsername on page load
window.addEventListener("load", fetchUsername);