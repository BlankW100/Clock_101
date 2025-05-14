let darkmode = localStorage.getItem('darkmode');
const themeSwitch = document.getElementById('theme-switch');
const themeModeSelect = document.getElementById('theme-mode'); // For profile.html

// Enable dark mode
const enableDarkmode = () => {
  document.body.classList.add('darkmode');
  localStorage.setItem('darkmode', 'active');
  if (themeModeSelect) themeModeSelect.value = 'dark'; // Sync dropdown in profile.html
};

// Disable dark mode
const disableDarkmode = () => {
  document.body.classList.remove('darkmode');
  localStorage.setItem('darkmode', null);
  if (themeModeSelect) themeModeSelect.value = 'light'; // Sync dropdown in profile.html
};

// Initialize dark mode on page load
if (darkmode === 'active') enableDarkmode();

// Event listener for the theme switch button (index.html)
if (themeSwitch) {
  themeSwitch.addEventListener('click', () => {
    darkmode = localStorage.getItem('darkmode');
    darkmode !== 'active' ? enableDarkmode() : disableDarkmode();
  });
}

// Event listener for the theme dropdown (profile.html)
if (themeModeSelect) {
  themeModeSelect.addEventListener('change', (event) => {
    event.target.value === 'dark' ? enableDarkmode() : disableDarkmode();
  });
}