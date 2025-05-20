// Show user's timezone at the top
function showUserTimezone() {
    let tz = moment.tz.guess();
    let now = moment().tz(tz);
    let offset = now.format('Z');
    let display = `${tz}  ${now.format('hh:mm a')} UTC${offset}`;
    document.getElementById('user-tz').textContent = display;
}
showUserTimezone();

// SVG map setup
const svg = document.getElementById('timezone-map');
const width = 1000;
const height = 500;
svg.setAttribute('width', width);
svg.setAttribute('height', height);
svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

// Improved manually calibrated city positions (x, y in SVG pixels)
const cities = [
    { name: "New York",      tz: "America/New_York",      x: 410, y: 175 },
    { name: "London",        tz: "Europe/London",         x: 510, y: 110 },
    { name: "Tokyo",         tz: "Asia/Tokyo",            x: 870, y: 185 },
    { name: "Sydney",        tz: "Australia/Sydney",      x: 930, y: 355 },
    { name: "Los Angeles",   tz: "America/Los_Angeles",   x: 170, y: 210 },
    { name: "Paris",         tz: "Europe/Paris",          x: 530, y: 125 },
    { name: "Dubai",         tz: "Asia/Dubai",            x: 655, y: 180 },
    { name: "Shanghai",      tz: "Asia/Shanghai",         x: 805, y: 170 },
    { name: "Moscow",        tz: "Europe/Moscow",         x: 625, y: 90 },
    { name: "Rio",           tz: "America/Sao_Paulo",     x: 430, y: 325 },
    { name: "Cape Town",     tz: "Africa/Johannesburg",   x: 570, y: 410 },
    { name: "Delhi",         tz: "Asia/Kolkata",          x: 735, y: 170 },
    { name: "Auckland",      tz: "Pacific/Auckland",      x: 970, y: 420 },
    { name: "Anchorage",     tz: "America/Anchorage",     x: 90,  y: 80  },
    { name: "Honolulu",      tz: "Pacific/Honolulu",      x: 120, y: 260 },
    { name: "Cairo",         tz: "Africa/Cairo",          x: 600, y: 180 },
    { name: "Beijing",       tz: "Asia/Shanghai",         x: 790, y: 150 },
    { name: "Singapore",     tz: "Asia/Singapore",        x: 820, y: 260 },
    { name: "Berlin",        tz: "Europe/Berlin",         x: 555, y: 115 },
    { name: "Mexico City",   tz: "America/Mexico_City",   x: 230, y: 230 }
];
// Draw dots and labels for each city using manual x/y
const labelPositions = [];
cities.forEach(city => {
    let dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("cx", city.x);
    dot.setAttribute("cy", city.y);
    dot.setAttribute("r", 6);
    dot.setAttribute("fill", "#fff");
    dot.setAttribute("stroke", "#222");
    dot.setAttribute("stroke-width", "2");
    dot.style.cursor = "pointer";
    dot.setAttribute("data-tz", city.tz);
    dot.setAttribute("data-name", city.name);
    svg.appendChild(dot);

    // Add label with dynamic positioning
    let label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    let offsetX = city.x < width / 2 ? 15 : -15;
    let offsetY = 5;

    // Check for nearby labels in the X direction and adjust Y if needed
    const nearbyLabels = labelPositions.filter(pos => Math.abs(pos.x - city.x) < 50);
    if (nearbyLabels.length > 0) {
        offsetY += nearbyLabels.length * 15;
    }

    label.setAttribute("x", city.x + offsetX);
    label.setAttribute("y", city.y + offsetY);
    label.setAttribute("fill", "#fff");
    label.setAttribute("font-size", "13");
    label.setAttribute("font-family", "monospace");
    label.setAttribute("stroke", "#222");
    label.setAttribute("stroke-width", "0.8");
    label.setAttribute("text-anchor", city.x < width / 2 ? "start" : "end");
    label.textContent = city.name;
    svg.appendChild(label);

    labelPositions.push({ x: city.x, y: city.y + offsetY });
});

// Tooltip logic
const tooltip = document.getElementById('tooltip');
svg.addEventListener('mousemove', function(e) {
    let target = e.target;
    if (target.tagName === "circle" && target.hasAttribute("data-tz")) {
        let tz = target.getAttribute("data-tz");
        let name = target.getAttribute("data-name");
        let now = moment().tz(tz);
        let offset = now.format('Z');
        let timeStr = `${tz}  ${now.format('hh:mm a')} UTC${offset}`;
        tooltip.style.display = "block";
        tooltip.innerHTML = `<strong>${name}</strong><br>${timeStr}`;
        tooltip.style.left = (e.pageX + 15) + "px";
        tooltip.style.top = (e.pageY - 30) + "px";
    } else {
        tooltip.style.display = "none";
    }
});
svg.addEventListener('mouseleave', function() {
    tooltip.style.display = "none";
});