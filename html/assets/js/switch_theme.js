import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

  // Your Firebase config
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

  function applyTheme(theme) {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }

  toggleBtn.addEventListener("click", async () => {
    const currentTheme = document.body.classList.contains("dark") ? "dark" : "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(newTheme);

    // Save to Firebase if user is logged in
    const user = auth.currentUser;
    if (user) {
      await setDoc(doc(db, "users", user.uid), { theme: newTheme }, { merge: true });
    } else {
      // Or save to localStorage
      localStorage.setItem("theme", newTheme);
    }
  });

  // On load
  onAuthStateChanged(auth, async (user) => {
    let savedTheme;
    if (user) {
      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (docSnap.exists()) {
        savedTheme = docSnap.data().theme;
      }
    } else {
      savedTheme = localStorage.getItem("theme");
    }

    applyTheme(savedTheme || "light");
  });