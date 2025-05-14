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

// Fetch user settings
export const fetchUserSettings = async () => {
  const userId = sessionStorage.getItem("userId");
  if (!userId) {
    console.error("No userId found in sessionStorage!");
    return null;
  }

  try {
    const userDoc = doc(db, "users", userId);
    const userSnapshot = await getDoc(userDoc);

    if (userSnapshot.exists()) {
      return userSnapshot.data();
    } else {
      console.error("No such user document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user settings:", error);
    return null;
  }
};