// assets/js/timezone-utils.js
import { timezones } from './timezones.js';

// Initialize Day.js plugins
dayjs.extend(dayjs_plugin_utc);
dayjs.extend(dayjs_plugin_timezone);
dayjs.extend(dayjs_plugin_customParseFormat);

export function populateTimezoneSelect(selectId, defaultTz = null) {
    const select = document.getElementById(selectId);
    select.innerHTML = '';
    
    timezones.forEach(tz => {
        const option = new Option(tz.label, tz.value);
        select.add(option);
    });
    
    if (defaultTz) select.value = defaultTz;
}

export function calculateTime({ startDatetime, startTz, operation, days, hours, minutes, targetTz }) {
    // Parse input with custom format
    const parsedTime = dayjs(startDatetime, 'DD-MM-YYYY HH:mm', true);
    if (!parsedTime.isValid()) throw new Error("Invalid date format");
    
    // Apply operation in original timezone
    let result = parsedTime.tz(startTz);
    if (operation === 'add') {
        result = result.add(days, 'day').add(hours, 'hour').add(minutes, 'minute');
    } else {
        result = result.subtract(days, 'day').subtract(hours, 'hour').subtract(minutes, 'minute');
    }
    
    // Convert to target timezone
    return result.tz(targetTz);
}