import { 
    populateTimezoneSelect,
    convertTimeBetweenTimezones,
    formatTimeForTimezone,
    formatDateForTimezone
  } from './timezone-utils.js';
  
  document.addEventListener('DOMContentLoaded', function() {
    const baseSelect = document.getElementById('base-timezone');
    const targetSelect = document.getElementById('target-timezone');
    const resultDiv = document.getElementById('conversion-result');
    
    // Initialize dropdowns
    populateTimezoneSelect(baseSelect, dayjs.tz.guess());
    populateTimezoneSelect(targetSelect, 'Europe/London');
    
    // Set up event listeners
    baseSelect.addEventListener('change', updateConversion);
    targetSelect.addEventListener('change', updateConversion);
    
    function updateConversion() {
      const fromTz = baseSelect.value;
      const toTz = targetSelect.value;
      const now = new Date();
      
      const convertedTime = convertTimeBetweenTimezones(now, fromTz, toTz);
      
      resultDiv.innerHTML = `
        <h3>${formatDateForTimezone(convertedTime, toTz)}</h3>
        <p class="time">${formatTimeForTimezone(convertedTime, toTz)}</p>
        <p class="timezone">${targetSelect.options[targetSelect.selectedIndex].text}</p>
      `;
    }
    
    // Initial conversion
    updateConversion();
  });