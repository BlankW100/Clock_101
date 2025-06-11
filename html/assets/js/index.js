let timeFormat = localStorage.getItem('clock101_timeFormat') || '24';

function getTimeFormat() {
    return timeFormat === 'ampm' ? 'hh:mm:ss A' : 'HH:mm:ss';
}
function getDateTimeFormat() {
    return timeFormat === 'ampm'
        ? 'dddd, MMMM D, YYYY - hh:mm:ss A'
        : 'dddd, MMMM D, YYYY - HH:mm:ss';
}

// Live clock for hero section
function updateLiveClock() {
    const el = document.getElementById('live-clock');
    if (el) {
        const now = moment();
        el.textContent = now.format(getDateTimeFormat());
    }
}
setInterval(updateLiveClock, 1000);
updateLiveClock();

// Quick world clocks
function updateQuickClocks() {
    document.getElementById('ny-time').textContent = moment().tz("America/New_York").format(getTimeFormat());
    document.getElementById('ldn-time').textContent = moment().tz("Europe/London").format(getTimeFormat());
    document.getElementById('tokyo-time').textContent = moment().tz("Asia/Tokyo").format(getTimeFormat());
    document.getElementById('syd-time').textContent = moment().tz("Australia/Sydney").format(getTimeFormat());
}
setInterval(updateQuickClocks, 1000);
updateQuickClocks();

// Time format toggle
document.addEventListener('DOMContentLoaded', function () {
    const format24 = document.getElementById('format-24');
    const formatAMPM = document.getElementById('format-ampm');
    if (timeFormat === 'ampm') {
        formatAMPM.checked = true;
    } else {
        format24.checked = true;
    }
    format24.addEventListener('change', function () {
        if (this.checked) {
            timeFormat = '24';
            localStorage.setItem('clock101_timeFormat', '24');
            updateLiveClock();
            updateQuickClocks();
        }
    });
    formatAMPM.addEventListener('change', function () {
        if (this.checked) {
            timeFormat = 'ampm';
            localStorage.setItem('clock101_timeFormat', 'ampm');
            updateLiveClock();
            updateQuickClocks();
        }
    });
});