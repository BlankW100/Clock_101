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
    const tooltip = document.getElementById('tooltip');

    // Style the tooltip
    tooltip.style.position = 'absolute';
    tooltip.style.background = 'rgba(0,0,0,0.8)';
    tooltip.style.color = 'white';
    tooltip.style.padding = '8px 12px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.fontSize = '14px';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.display = 'none';
    tooltip.style.zIndex = '100';

    // Improved city coordinates for 2000x1000 SVG
    const cities = [
        { name: "New York",      tz: "America/New_York",      x: 820,  y: 350 },
        { name: "London",        tz: "Europe/London",         x: 1120, y: 220 },
        { name: "Tokyo",         tz: "Asia/Tokyo",            x: 1720, y: 340 },
        { name: "Sydney",        tz: "Australia/Sydney",      x: 1850, y: 700 },
        { name: "Los Angeles",   tz: "America/Los_Angeles",   x: 340,  y: 370 },
        { name: "Paris",         tz: "Europe/Paris",          x: 1160, y: 250 },
        { name: "Dubai",         tz: "Asia/Dubai",            x: 1340, y: 340 },
        { name: "Shanghai",      tz: "Asia/Shanghai",         x: 1600, y: 320 },
        { name: "Moscow",        tz: "Europe/Moscow",         x: 1320, y: 180 },
        { name: "Rio",           tz: "America/Sao_Paulo",     x: 900,  y: 670 },
        { name: "Cape Town",     tz: "Africa/Johannesburg",   x: 1200, y: 850 },
        { name: "Delhi",         tz: "Asia/Kolkata",          x: 1480, y: 340 },
        { name: "Auckland",      tz: "Pacific/Auckland",      x: 1960, y: 870 },
        { name: "Anchorage",     tz: "America/Anchorage",     x: 120,  y: 120 },
        { name: "Honolulu",      tz: "Pacific/Honolulu",      x: 220,  y: 480 },
        { name: "Cairo",         tz: "Africa/Cairo",          x: 1260, y: 340 },
        { name: "Beijing",       tz: "Asia/Shanghai",         x: 1550, y: 270 },
        { name: "Singapore",     tz: "Asia/Singapore",        x: 1590, y: 510 },
        { name: "Berlin",        tz: "Europe/Berlin",         x: 1190, y: 220 },
        { name: "Mexico City",   tz: "America/Mexico_City",   x: 480,  y: 430 }
    ];

    // Draw dots and labels for each city
    const labelPositions = [];
    cities.forEach(city => {
        // Create city dot
        const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        dot.setAttribute("cx", city.x);
        dot.setAttribute("cy", city.y);
        dot.setAttribute("r", "12");
        dot.setAttribute("fill", "#fff");
        dot.setAttribute("stroke", "#222");
        dot.setAttribute("stroke-width", "3");
        dot.style.cursor = "pointer";
        dot.setAttribute("data-tz", city.tz);
        dot.setAttribute("data-name", city.name);
        svg.appendChild(dot);

        // Create city label
        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        let offsetX = city.x < 1000 ? 25 : -25;
        let offsetY = 12;

        // Adjust for overlapping labels
        if (city.name === "Los Angeles") offsetY = -18;
        if (city.name === "Honolulu") offsetY = -18;
        if (city.name === "Anchorage") offsetY = -18;
        if (city.name === "Mexico City") offsetX = 25;
        if (city.name === "Rio") offsetY = -18;
        if (city.name === "Cape Town") offsetY = -18;
        if (city.name === "Auckland") offsetX = -25;

        label.setAttribute("x", city.x + offsetX);
        label.setAttribute("y", city.y + offsetY);
        label.setAttribute("fill", "#222");
        label.setAttribute("font-size", "24");
        label.setAttribute("font-family", "monospace");
        label.setAttribute("text-anchor", city.x < 1000 ? "start" : "end");
        label.textContent = city.name;
        svg.appendChild(label);

        labelPositions.push({ x: city.x, y: city.y + offsetY });
    });

    // Tooltip functionality
    svg.addEventListener('mousemove', function(e) {
        const target = e.target;
        if (target.tagName === "circle" && target.hasAttribute("data-tz")) {
            const tz = target.getAttribute("data-tz");
            const name = target.getAttribute("data-name");
            const now = moment().tz(tz);
            const offset = now.format('Z');
            const timeStr = `${tz}  ${now.format('hh:mm a')} (UTC${offset})`;

            tooltip.style.display = "block";
            tooltip.innerHTML = `<strong>${name}</strong><br>${timeStr}`;
            tooltip.style.left = (e.clientX + 15) + "px";
            tooltip.style.top = (e.clientY + window.scrollY - 30) + "px";
        } else {
            tooltip.style.display = "none";
        }
    });

    svg.addEventListener('mouseleave', function() {
        tooltip.style.display = "none";
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initTimezoneMap);