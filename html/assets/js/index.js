// Live clock for hero section
function updateLiveClock() {
    const el = document.getElementById('live-clock');
    if (el) {
        const now = moment();
        el.textContent = now.format('dddd, MMMM D, YYYY - HH:mm:ss');
    }
}
setInterval(updateLiveClock, 1000);
updateLiveClock();

// Quick world clocks
function updateQuickClocks() {
    document.getElementById('ny-time').textContent = moment().tz("America/New_York").format('HH:mm:ss');
    document.getElementById('ldn-time').textContent = moment().tz("Europe/London").format('HH:mm:ss');
    document.getElementById('tokyo-time').textContent = moment().tz("Asia/Tokyo").format('HH:mm:ss');
    document.getElementById('syd-time').textContent = moment().tz("Australia/Sydney").format('HH:mm:ss');
}
setInterval(updateQuickClocks, 1000);
updateQuickClocks();