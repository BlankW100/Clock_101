// Show user's timezone at the top
function showUserTimezone() {
    const tz = moment.tz.guess();
    const now = moment().tz(tz);
    const offset = now.format('Z');
    const display = `${tz}  ${now.format('hh:mm a')} UTC${offset}`;
    document.getElementById('user-tz').textContent = display;
}

// Update time every minute
function initTimezoneMap() {
    showUserTimezone();
    setInterval(showUserTimezone, 60000);

    // SVG map setup
    const svg = document.getElementById('timezone-map');
    const cityTzDiv = document.getElementById('city-tz');

    // Fine-tuned city coordinates and label offsets for 1450x711 SVG
    const cities = [
        { name: "New York",      tz: "America/New_York",      x: 670,  y: 270,  labelDX: 18,  labelDY: -10, anchor: "start" }, // USA East Coast
        { name: "London",        tz: "Europe/London",         x: 930,  y: 150,  labelDX: 10,  labelDY: -14, anchor: "start" }, // UK
        { name: "Tokyo",         tz: "Asia/Tokyo",            x: 1340, y: 230,  labelDX: 12,  labelDY: -18, anchor: "start" }, // Japan
        { name: "Sydney",        tz: "Australia/Sydney",      x: 1395, y: 610,  labelDX: 10,  labelDY: 24,  anchor: "start" }, // Australia
        { name: "Los Angeles",   tz: "America/Los_Angeles",   x: 170,  y: 290,  labelDX: 10,  labelDY: -12, anchor: "start" }, // USA West Coast
        { name: "Paris",         tz: "Europe/Paris",          x: 970,  y: 170,  labelDX: 10,  labelDY: 20,  anchor: "start" }, // France
        { name: "Dubai",         tz: "Asia/Dubai",            x: 1120, y: 270,  labelDX: 10,  labelDY: 20,  anchor: "start" }, // UAE
        { name: "Shanghai",      tz: "Asia/Shanghai",         x: 1245, y: 210,  labelDX: 10,  labelDY: 20,  anchor: "start" }, // China
        { name: "Moscow",        tz: "Europe/Moscow",         x: 1080, y: 110,  labelDX: 10,  labelDY: -12, anchor: "start" }, // Russia
        { name: "Rio",           tz: "America/Sao_Paulo",     x: 730,  y: 540,  labelDX: 10,  labelDY: 20,  anchor: "start" }, // Brazil
        { name: "Cape Town",     tz: "Africa/Johannesburg",   x: 970,  y: 670,  labelDX: 10,  labelDY: 20,  anchor: "start" }, // South Africa
        { name: "Delhi",         tz: "Asia/Kolkata",          x: 1180, y: 260,  labelDX: 10,  labelDY: -12, anchor: "start" }, // India
        { name: "Auckland",      tz: "Pacific/Auckland",      x: 1420, y: 690,  labelDX: -10, labelDY: 20,  anchor: "end" },   // New Zealand
        { name: "Anchorage",     tz: "America/Anchorage",     x: 110,  y: 110,  labelDX: 10,  labelDY: -12, anchor: "start" }, // Alaska
        { name: "Honolulu",      tz: "Pacific/Honolulu",      x: 210,  y: 390,  labelDX: 10,  labelDY: 20,  anchor: "start" }, // Hawaii
        { name: "Cairo",         tz: "Africa/Cairo",          x: 1040, y: 270,  labelDX: 10,  labelDY: -12, anchor: "start" }, // Egypt
        { name: "Beijing",       tz: "Asia/Shanghai",         x: 1260, y: 190,  labelDX: 10,  labelDY: -12, anchor: "start" }, // China
        { name: "Singapore",     tz: "Asia/Singapore",        x: 1280, y: 390,  labelDX: 10,  labelDY: 20,  anchor: "start" }, // Singapore
        { name: "Berlin",        tz: "Europe/Berlin",         x: 980,  y: 160,  labelDX: 10,  labelDY: -12, anchor: "start" }, // Germany
        { name: "Mexico City",   tz: "America/Mexico_City",   x: 390,  y: 350,  labelDX: 10,  labelDY: 20,  anchor: "start" }  // Mexico
    ];

    // Draw dots and labels for each city
    cities.forEach(city => {
        // Create city dot
        const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        dot.setAttribute("cx", city.x);
        dot.setAttribute("cy", city.y);
        dot.setAttribute("r", "10");
        dot.setAttribute("fill", "#fff");
        dot.setAttribute("stroke", "#222");
        dot.setAttribute("stroke-width", "2");
        dot.style.cursor = "pointer";
        dot.setAttribute("data-tz", city.tz);
        dot.setAttribute("data-name", city.name);
        svg.appendChild(dot);

        // Create city label with manual offset and anchor
        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", city.x + city.labelDX);
        label.setAttribute("y", city.y + city.labelDY);
        label.setAttribute("fill", "#222");
        label.setAttribute("font-size", "18");
        label.setAttribute("font-family", "monospace");
        label.setAttribute("text-anchor", city.anchor);
        label.textContent = city.name;
        label.style.cursor = "pointer";
        svg.appendChild(label);

        // Show city time on click (dot or label)
        function showCityTime() {
            const now = moment().tz(city.tz);
            const offset = now.format('Z');
            const cityDisplay = `${city.tz}  ${now.format('hh:mm a')} UTC${offset}`;
            cityTzDiv.innerHTML = `<span style="color:#000;"><b>${city.name}:</b></span> ${cityDisplay}`;
        }
        dot.addEventListener('click', showCityTime);
        label.addEventListener('click', showCityTime);
    });
}

document.addEventListener('DOMContentLoaded', initTimezoneMap);