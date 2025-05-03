import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

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

logoutBtn.addEventListener('click', () => {
    auth.signOut()
      .then(() => {
        messageEl.textContent = 'Successfully logged out.';
        messageEl.style.color = 'green';
        alert("Sign Out successfully!");
        // Optionally redirect to login page or homepage after logout
        // window.location.href = 'login.html';
      })
      .catch(error => {
        messageEl.textContent = 'Logout failed: ' + error.message;
        messageEl.style.color = 'red';
        alert(`Error: ${errorMessage}`);
      });
  });