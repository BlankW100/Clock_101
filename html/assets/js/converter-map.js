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

// Equirectangular projection (SVG: lon -180~180, lat 90~-90)
function lon2x(lon) { return ((lon + 180) / 360) * width; }
function lat2y(lat) { return ((90 - lat) / 180) * height; }

// Example city/timezone data (expand as needed)
const cities = [
    { name: "New York", tz: "America/New_York", lat: 40.7128, lon: -74.0060 },
    { name: "London", tz: "Europe/London", lat: 51.5074, lon: -0.1278 },
    { name: "Tokyo", tz: "Asia/Tokyo", lat: 35.6895, lon: 139.6917 },
    { name: "Sydney", tz: "Australia/Sydney", lat: -33.8688, lon: 151.2093 },
    { name: "Los Angeles", tz: "America/Los_Angeles", lat: 34.0522, lon: -118.2437 },
    { name: "Paris", tz: "Europe/Paris", lat: 48.8566, lon: 2.3522 },
    { name: "Dubai", tz: "Asia/Dubai", lat: 25.2048, lon: 55.2708 },
    { name: "Shanghai", tz: "Asia/Shanghai", lat: 31.2304, lon: 121.4737 },
    { name: "Moscow", tz: "Europe/Moscow", lat: 55.7558, lon: 37.6173 },
    { name: "Rio", tz: "America/Sao_Paulo", lat: -22.9068, lon: -43.1729 },
    { name: "Cape Town", tz: "Africa/Johannesburg", lat: -33.9249, lon: 18.4241 },
    { name: "Delhi", tz: "Asia/Kolkata", lat: 28.6139, lon: 77.2090 },
    { name: "Auckland", tz: "Pacific/Auckland", lat: -36.8485, lon: 174.7633 },
    { name: "Anchorage", tz: "America/Anchorage", lat: 61.2181, lon: -149.9003 },
    { name: "Honolulu", tz: "Pacific/Honolulu", lat: 21.3069, lon: -157.8583 },
    { name: "Cairo", tz: "Africa/Cairo", lat: 30.0444, lon: 31.2357 },
    { name: "Beijing", tz: "Asia/Shanghai", lat: 39.9042, lon: 116.4074 },
    { name: "Singapore", tz: "Asia/Singapore", lat: 1.3521, lon: 103.8198 },
    { name: "Berlin", tz: "Europe/Berlin", lat: 52.5200, lon: 13.4050 },
    { name: "Mexico City", tz: "America/Mexico_City", lat: 19.4326, lon: -99.1332 }
];

// Draw dots and labels for each city
cities.forEach(city => {
    let x = lon2x(city.lon);
    let y = lat2y(city.lat);
    let dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("cx", x);
    dot.setAttribute("cy", y);
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
    label.setAttribute("x", x + 10);
    label.setAttribute("y", y + 4);
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