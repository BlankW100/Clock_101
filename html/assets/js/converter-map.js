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
const width = 564.444; // Match your SVG viewBox width
const height = 241.653 ; // Match your SVG viewBox height
svg.setAttribute('width', width);
svg.setAttribute('height', height);

// Calibrated projection functions
function lon2x(lon) {
    let x = ((lon + 180) / 360) * 564.444 + 104.775;
    return ((x - 104.775) / 564.444) * 1000;
}
function lat2y(lat) {
    let y = ((90 - lat) / 180) * 241.653 + (-148.696);
    return ((y + 148.696) / 241.653) * 500;
}

// City data (lat/lon for tooltip, but x/y for placement)
const cities = [
    { name: "New York", tz: "America/New_York", lat: 40.7128, lon: -74.0060, x: 294.43, y: 136.91 },
    { name: "London", tz: "Europe/London", lat: 51.5074, lon: -0.1278, x: 499.65, y: 106.92 },
    { name: "Tokyo", tz: "Asia/Tokyo", lat: 35.6895, lon: 139.6917, x: 888.03, y: 150.86 },
    { name: "Sydney", tz: "Australia/Sydney", lat: -33.8688, lon: 151.2093, x: 920.03, y: 344.08 },
    { name: "Los Angeles", tz: "America/Los_Angeles", lat: 34.0522, lon: -118.2437, x: 171.55, y: 155.41 },
    { name: "Paris", tz: "Europe/Paris", lat: 48.8566, lon: 2.3522, x: 506.53, y: 114.29 },
    { name: "Dubai", tz: "Asia/Dubai", lat: 25.2048, lon: 55.2708, x: 653.53, y: 179.99 },
    { name: "Shanghai", tz: "Asia/Shanghai", lat: 31.2304, lon: 121.4737, x: 837.43, y: 163.25 },
    { name: "Moscow", tz: "Europe/Moscow", lat: 55.7558, lon: 37.6173, x: 604.49, y: 95.12 },
    { name: "Rio", tz: "America/Sao_Paulo", lat: -22.9068, lon: -43.1729, x: 380.08, y: 313.63 },
    { name: "Cape Town", tz: "Africa/Johannesburg", lat: -33.9249, lon: 18.4241, x: 551.18, y: 344.24 },
    { name: "Delhi", tz: "Asia/Kolkata", lat: 28.6139, lon: 77.2090, x: 714.47, y: 170.52 },
    { name: "Auckland", tz: "Pacific/Auckland", lat: -36.8485, lon: 174.7633, x: 985.45, y: 352.36 },
    { name: "Anchorage", tz: "America/Anchorage", lat: 61.2181, lon: -149.9003, x: 83.61, y: 79.95 },
    { name: "Honolulu", tz: "Pacific/Honolulu", lat: 21.3069, lon: -157.8583, x: 61.50, y: 190.81 },
    { name: "Cairo", tz: "Africa/Cairo", lat: 30.0444, lon: 31.2357, x: 586.77, y: 166.54 },
    { name: "Beijing", tz: "Asia/Shanghai", lat: 39.9042, lon: 116.4074, x: 823.35, y: 139.16 },
    { name: "Singapore", tz: "Asia/Singapore", lat: 1.3521, lon: 103.8198, x: 788.39, y: 246.24 },
    { name: "Berlin", tz: "Europe/Berlin", lat: 52.5200, lon: 13.4050, x: 537.24, y: 104.11 },
    { name: "Mexico City", tz: "America/Mexico_City", lat: 19.4326, lon: -99.1332, x: 224.63, y: 196.02 }
];

// Draw dots and labels for each city using provided x/y
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

    // Add label
    let label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", city.x + 10);
    label.setAttribute("y", city.y + 4);
    label.setAttribute("fill", "#fff");
    label.setAttribute("font-size", "13");
    label.setAttribute("font-family", "monospace");
    label.setAttribute("stroke", "#222");
    label.setAttribute("stroke-width", "0.8");
    label.textContent = city.name;
    svg.appendChild(label);
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