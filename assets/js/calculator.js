// assets/js/calculator.js
import { populateTimezoneSelect, calculateTime } from './timezone-utils.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize dropdowns
    populateTimezoneSelect('start-timezone', dayjs.tz.guess());
    populateTimezoneSelect('target-timezone', 'Europe/London');
    
    // Calculate button handler
    document.getElementById('calculate-btn').addEventListener('click', () => {
        try {
            const result = calculateTime({
                startDatetime: document.getElementById('start-datetime').value,
                startTz: document.getElementById('start-timezone').value,
                operation: document.getElementById('operation').value,
                days: parseInt(document.getElementById('days').value) || 0,
                hours: parseInt(document.getElementById('hours').value) || 0,
                minutes: parseInt(document.getElementById('minutes').value) || 0,
                targetTz: document.getElementById('target-timezone').value
            });
            
            // Display results
            document.getElementById('result').innerHTML = `
                <h3>Result in ${document.getElementById('target-timezone').options[
                    document.getElementById('target-timezone').selectedIndex].text}:</h3>
                <p class="result-date">${result.format('dddd, D MMMM YYYY')}</p>
                <p class="result-time">${result.format('HH:mm')}</p>
            `;
        } catch (error) {
            document.getElementById('result').innerHTML = `
                <p class="error">Error: ${error.message}</p>
            `;
        }
    });
});