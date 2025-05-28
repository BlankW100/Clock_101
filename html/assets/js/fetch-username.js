// Remove Firebase imports and initialization
// Use db from global scope (initialized in myevent.js)

// Fetch username from Firestore
const fetchUsername = async () => {
  const userId = sessionStorage.getItem("userId"); // Use directly, no JSON.parse
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