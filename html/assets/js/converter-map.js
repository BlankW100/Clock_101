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
const width = 1000; // Match your SVG viewBox width
const height = 500; // Match your SVG viewBox height
svg.setAttribute('width', width);
svg.setAttribute('height', height);
svg.setAttribute('viewBox', `0 0 ${width} ${height}`); // Ensure viewBox matches dimensions

// Mercator projection for world map (like moment-timezone)
function lon2x(lon) {
    return ((lon + 180) / 360) * width;
}
function lat2y(lat) {
    // Clamp latitude to avoid infinity at the poles
    const maxLat = 85.05112878;
    lat = Math.max(Math.min(lat, maxLat), -maxLat);
    const latRad = lat * Math.PI / 180;
    return (0.5 - Math.log(Math.tan(Math.PI / 4 + latRad / 2)) / (2 * Math.PI)) * height;
}

// City data (from moment-timezone map)
const cities = [
    { name: "New York", tz: "America/New_York", lat: 40.71427, lon: -74.00597, x: lon2x(-74.00597), y: lat2y(40.71427) },
    { name: "London", tz: "Europe/London", lat: 51.50853, lon: -0.12574, x: lon2x(-0.12574), y: lat2y(51.50853) },
    { name: "Tokyo", tz: "Asia/Tokyo", lat: 35.6895, lon: 139.69171, x: lon2x(139.69171), y: lat2y(35.6895) },
    { name: "Sydney", tz: "Australia/Sydney", lat: -33.86785, lon: 151.20732, x: lon2x(151.20732), y: lat2y(-33.86785) },
    { name: "Los Angeles", tz: "America/Los_Angeles", lat: 34.05223, lon: -118.24368, x: lon2x(-118.24368), y: lat2y(34.05223) },
    { name: "Paris", tz: "Europe/Paris", lat: 48.85341, lon: 2.3488, x: lon2x(2.3488), y: lat2y(48.85341) },
    { name: "Dubai", tz: "Asia/Dubai", lat: 25.25817, lon: 55.30472, x: lon2x(55.30472), y: lat2y(25.25817) },
    { name: "Shanghai", tz: "Asia/Shanghai", lat: 31.22222, lon: 121.45806, x: lon2x(121.45806), y: lat2y(31.22222) },
    { name: "Moscow", tz: "Europe/Moscow", lat: 55.75222, lon: 37.61556, x: lon2x(37.61556), y: lat2y(55.75222) },
    { name: "Rio", tz: "America/Sao_Paulo", lat: -22.90278, lon: -43.2075, x: lon2x(-43.2075), y: lat2y(-22.90278) },
    { name: "Cape Town", tz: "Africa/Johannesburg", lat: -33.92584, lon: 18.42322, x: lon2x(18.42322), y: lat2y(-33.92584) },
    { name: "Delhi", tz: "Asia/Kolkata", lat: 28.65195, lon: 77.23149, x: lon2x(77.23149), y: lat2y(28.65195) },
    { name: "Auckland", tz: "Pacific/Auckland", lat: -36.86667, lon: 174.76667, x: lon2x(174.76667), y: lat2y(-36.86667) },
    { name: "Anchorage", tz: "America/Anchorage", lat: 61.21806, lon: -149.90028, x: lon2x(-149.90028), y: lat2y(61.21806) },
    { name: "Honolulu", tz: "Pacific/Honolulu", lat: 21.30694, lon: -157.85833, x: lon2x(-157.85833), y: lat2y(21.30694) },
    { name: "Cairo", tz: "Africa/Cairo", lat: 30.06263, lon: 31.24967, x: lon2x(31.24967), y: lat2y(30.06263) },
    { name: "Beijing", tz: "Asia/Shanghai", lat: 39.9075, lon: 116.39723, x: lon2x(116.39723), y: lat2y(39.9075) },
    { name: "Singapore", tz: "Asia/Singapore", lat: 1.28967, lon: 103.85007, x: lon2x(103.85007), y: lat2y(1.28967) },
    { name: "Berlin", tz: "Europe/Berlin", lat: 52.52437, lon: 13.41053, x: lon2x(13.41053), y: lat2y(52.52437) },
    { name: "Mexico City", tz: "America/Mexico_City", lat: 19.42847, lon: -99.12766, x: lon2x(-99.12766), y: lat2y(19.42847) }
];

// Draw dots and labels for each city using recalculated x/y
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