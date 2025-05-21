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

    // Major cities with their timezones and positions
   const cities = [
    { name: "New York",      tz: "America/New_York",      x: 589,  y: 235 },
    { name: "London",        tz: "Europe/London",         x: 999,  y: 183 },
    { name: "Tokyo",         tz: "Asia/Tokyo",            x: 1776, y: 259 },
    { name: "Sydney",        tz: "Australia/Sydney",      x: 1840, y: 590 },
    { name: "Los Angeles",   tz: "America/Los_Angeles",   x: 343,  y: 266 },
    { name: "Paris",         tz: "Europe/Paris",          x: 1013, y: 196 },
    { name: "Dubai",         tz: "Asia/Dubai",            x: 1307, y: 308 },
    { name: "Shanghai",      tz: "Asia/Shanghai",         x: 1675, y: 280 },
    { name: "Moscow",        tz: "Europe/Moscow",         x: 1209, y: 163 },
    { name: "Rio",           tz: "America/Sao_Paulo",     x: 760,  y: 538 },
    { name: "Cape Town",     tz: "Africa/Johannesburg",   x: 1102, y: 590 },
    { name: "Delhi",         tz: "Asia/Kolkata",          x: 1429, y: 292 },
    { name: "Auckland",      tz: "Pacific/Auckland",      x: 1971, y: 604 },
    { name: "Anchorage",     tz: "America/Anchorage",     x: 167,  y: 137 },
    { name: "Honolulu",      tz: "Pacific/Honolulu",      x: 123,  y: 327 },
    { name: "Cairo",         tz: "Africa/Cairo",          x: 1174, y: 285 },
    { name: "Beijing",       tz: "Asia/Shanghai",         x: 1647, y: 239 },
    { name: "Singapore",     tz: "Asia/Singapore",        x: 1577, y: 422 },
    { name: "Berlin",        tz: "Europe/Berlin",         x: 1074, y: 178 },
    { name: "Mexico City",   tz: "America/Mexico_City",   x: 449,  y: 336 }
    ];
        
    // Draw dots and labels for each city
    cities.forEach(city => {
        // Create city dot
        const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        dot.setAttribute("cx", city.x);
        dot.setAttribute("cy", city.y);
        dot.setAttribute("r", "6");
        dot.setAttribute("fill", "#fff");
        dot.setAttribute("stroke", "#222");
        dot.setAttribute("stroke-width", "2");
        dot.style.cursor = "pointer";
        dot.setAttribute("data-tz", city.tz);
        dot.setAttribute("data-name", city.name);
        svg.appendChild(dot);

        // Create city label
        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        let offsetX = city.x < 500 ? 15 : -15;
        let offsetY = 5;
        
        // Adjust for overlapping labels
        if (city.name === "Los Angeles") offsetY = -10;
        if (city.name === "Honolulu") offsetY = -10;
        if (city.name === "Anchorage") offsetY = -10;
        if (city.name === "Mexico City") offsetX = 15;
        if (city.name === "Rio") offsetY = -10;
        if (city.name === "Cape Town") offsetY = -10;
        if (city.name === "Auckland") offsetX = -15;
        
        label.setAttribute("x", city.x + offsetX);
        label.setAttribute("y", city.y + offsetY);
        label.setAttribute("fill", "#222");
        label.setAttribute("font-size", "12");
        label.setAttribute("font-family", "Arial");
        label.setAttribute("text-anchor", city.x < 500 ? "start" : "end");
        label.textContent = city.name;
        svg.appendChild(label);
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