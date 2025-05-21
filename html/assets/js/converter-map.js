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

    // Manually calibrated city coordinates and label offsets for 1450x711 SVG
    const cities = [
        { name: "New York",      tz: "America/New_York",      x: 595,  y: 250,  labelDX: 20,  labelDY: 0,   anchor: "start" },
        { name: "London",        tz: "Europe/London",         x: 790,  y: 120,  labelDX: 10,  labelDY: -10, anchor: "start" },
        { name: "Tokyo",         tz: "Asia/Tokyo",            x: 1240, y: 220,  labelDX: 10,  labelDY: -15, anchor: "start" },
        { name: "Sydney",        tz: "Australia/Sydney",      x: 1350, y: 520,  labelDX: 10,  labelDY: 20,  anchor: "start" },
        { name: "Los Angeles",   tz: "America/Los_Angeles",   x: 250,  y: 260,  labelDX: 10,  labelDY: -10, anchor: "start" },
        { name: "Paris",         tz: "Europe/Paris",          x: 820,  y: 140,  labelDX: 10,  labelDY: 18,  anchor: "start" },
        { name: "Dubai",         tz: "Asia/Dubai",            x: 1000, y: 220,  labelDX: 10,  labelDY: 18,  anchor: "start" },
        { name: "Shanghai",      tz: "Asia/Shanghai",         x: 1170, y: 210,  labelDX: 10,  labelDY: 18,  anchor: "start" },
        { name: "Moscow",        tz: "Europe/Moscow",         x: 970,  y: 90,   labelDX: 10,  labelDY: -10, anchor: "start" },
        { name: "Rio",           tz: "America/Sao_Paulo",     x: 570,  y: 480,  labelDX: 10,  labelDY: 18,  anchor: "start" },
        { name: "Cape Town",     tz: "Africa/Johannesburg",   x: 820,  y: 610,  labelDX: 10,  labelDY: 18,  anchor: "start" },
        { name: "Delhi",         tz: "Asia/Kolkata",          x: 1100, y: 210,  labelDX: 10,  labelDY: -10, anchor: "start" },
        { name: "Auckland",      tz: "Pacific/Auckland",      x: 1400, y: 650,  labelDX: -10, labelDY: 18,  anchor: "end" },
        { name: "Anchorage",     tz: "America/Anchorage",     x: 80,   y: 60,   labelDX: 10,  labelDY: -10, anchor: "start" },
        { name: "Honolulu",      tz: "Pacific/Honolulu",      x: 140,  y: 340,  labelDX: 10,  labelDY: 18,  anchor: "start" },
        { name: "Cairo",         tz: "Africa/Cairo",          x: 900,  y: 220,  labelDX: 10,  labelDY: -10, anchor: "start" },
        { name: "Beijing",       tz: "Asia/Shanghai",         x: 1150, y: 170,  labelDX: 10,  labelDY: -10, anchor: "start" },
        { name: "Singapore",     tz: "Asia/Singapore",        x: 1200, y: 350,  labelDX: 10,  labelDY: 18,  anchor: "start" },
        { name: "Berlin",        tz: "Europe/Berlin",         x: 850,  y: 130,  labelDX: 10,  labelDY: -10, anchor: "start" },
        { name: "Mexico City",   tz: "America/Mexico_City",   x: 370,  y: 320,  labelDX: 10,  labelDY: 18,  anchor: "start" }
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
        svg.appendChild(label);

        // Add click event to show city time below user time
        dot.addEventListener('click', function() {
            const now = moment().tz(city.tz);
            const offset = now.format('Z');
            const cityDisplay = `${city.tz}  ${now.format('hh:mm a')} UTC${offset}`;
            cityTzDiv.innerHTML = `<span style="color:#ffa;"><b>${city.name}:</b></span> ${cityDisplay}`;
        });

        // Show city time on hover (not click)
        dot.addEventListener('mouseenter', function() {
            const now = moment().tz(city.tz);
            const offset = now.format('Z');
            const cityDisplay = `${city.tz}  ${now.format('hh:mm a')} UTC${offset}`;
            cityTzDiv.innerHTML = `<span style="color:#000;"><b>${city.name}:</b></span> ${cityDisplay}`;
        });
        dot.addEventListener('mouseleave', function() {
            cityTzDiv.innerHTML = "";
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initTimezoneMap);