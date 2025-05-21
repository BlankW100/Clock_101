import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

const toggleBtn = document.getElementById("theme-toggle");
const storageKey = "theme-preference";

// Function to apply the theme
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  toggleBtn.setAttribute("aria-label", theme);
}

// Function to save theme preference
async function saveThemePreference(theme) {
  const user = auth.currentUser;
  if (user) {
    // Save to Firebase
    await setDoc(doc(db, "users", user.uid), { theme }, { merge: true });
  } else {
    // Save to localStorage
    localStorage.setItem(storageKey, theme);
  }
}

// Function to get saved theme preference
async function getSavedThemePreference() {
  const user = auth.currentUser;
  if (user) {
    const docSnap = await getDoc(doc(db, "users", user.uid));
    if (docSnap.exists()) {
      return docSnap.data().theme;
    }
  } else {
    return localStorage.getItem(storageKey);
  }
  return null;
}

// Event listener for theme toggle button
toggleBtn.addEventListener("click", async () => {
  const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(newTheme);
  await saveThemePreference(newTheme);
});

// On load, apply the saved theme or default to light
onAuthStateChanged(auth, async () => {
  const savedTheme = await getSavedThemePreference();
  const preferredTheme = savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  applyTheme(preferredTheme);
});

// Sync with system theme changes
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", ({ matches: isDark }) => {
  const systemTheme = isDark ? "dark" : "light";
  applyTheme(systemTheme);
  saveThemePreference(systemTheme);
});