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
const height = 241.653; // Match your SVG viewBox height
svg.setAttribute('width', width);
svg.setAttribute('height', height);

// Corrected projection functions using Mercator
function lon2x(lon) {
    return ((lon + 180) / 360) * 564.444;
}

function lat2y(lat) {
    const radians = (lat * Math.PI) / 180;
    const mercator = Math.log(Math.tan(Math.PI / 4 + radians / 2));
    const mercatorMax = Math.log(Math.tan(Math.PI / 4 + (85 * Math.PI) / 360));
    const mercatorMin = Math.log(Math.tan(Math.PI / 4 + (-85 * Math.PI) / 360));
    return ((mercatorMax - mercator) / (mercatorMax - mercatorMin)) * 241.653;
}

// City data with recalculated x/y
const cities = [
    { name: "New York", tz: "America/New_York", lat: 40.7128, lon: -74.0060, x: lon2x(-74.0060), y: lat2y(40.7128) },
    { name: "London", tz: "Europe/London", lat: 51.5074, lon: -0.1278, x: lon2x(-0.1278), y: lat2y(51.5074) },
    { name: "Tokyo", tz: "Asia/Tokyo", lat: 35.6895, lon: 139.6917, x: lon2x(139.6917), y: lat2y(35.6895) },
    { name: "Sydney", tz: "Australia/Sydney", lat: -33.8688, lon: 151.2093, x: lon2x(151.2093), y: lat2y(-33.8688) },
    { name: "Los Angeles", tz: "America/Los_Angeles", lat: 34.0522, lon: -118.2437, x: lon2x(-118.2437), y: lat2y(34.0522) },
    { name: "Paris", tz: "Europe/Paris", lat: 48.8566, lon: 2.3522, x: lon2x(2.3522), y: lat2y(48.8566) },
    { name: "Dubai", tz: "Asia/Dubai", lat: 25.2048, lon: 55.2708, x: lon2x(55.2708), y: lat2y(25.2048) },
    { name: "Shanghai", tz: "Asia/Shanghai", lat: 31.2304, lon: 121.4737, x: lon2x(121.4737), y: lat2y(31.2304) },
    { name: "Moscow", tz: "Europe/Moscow", lat: 55.7558, lon: 37.6173, x: lon2x(37.6173), y: lat2y(55.7558) },
    { name: "Rio", tz: "America/Sao_Paulo", lat: -22.9068, lon: -43.1729, x: lon2x(-43.1729), y: lat2y(-22.9068) },
    { name: "Cape Town", tz: "Africa/Johannesburg", lat: -33.9249, lon: 18.4241, x: lon2x(18.4241), y: lat2y(-33.9249) },
    { name: "Delhi", tz: "Asia/Kolkata", lat: 28.6139, lon: 77.2090, x: lon2x(77.2090), y: lat2y(28.6139) },
    { name: "Auckland", tz: "Pacific/Auckland", lat: -36.8485, lon: 174.7633, x: lon2x(174.7633), y: lat2y(-36.8485) },
    { name: "Anchorage", tz: "America/Anchorage", lat: 61.2181, lon: -149.9003, x: lon2x(-149.9003), y: lat2y(61.2181) },
    { name: "Honolulu", tz: "Pacific/Honolulu", lat: 21.3069, lon: -157.8583, x: lon2x(-157.8583), y: lat2y(21.3069) },
    { name: "Cairo", tz: "Africa/Cairo", lat: 30.0444, lon: 31.2357, x: lon2x(31.2357), y: lat2y(30.0444) },
    { name: "Beijing", tz: "Asia/Shanghai", lat: 39.9042, lon: 116.4074, x: lon2x(116.4074), y: lat2y(39.9042) },
    { name: "Singapore", tz: "Asia/Singapore", lat: 1.3521, lon: 103.8198, x: lon2x(103.8198), y: lat2y(1.3521) },
    { name: "Berlin", tz: "Europe/Berlin", lat: 52.5200, lon: 13.4050, x: lon2x(13.4050), y: lat2y(52.5200) },
    { name: "Mexico City", tz: "America/Mexico_City", lat: 19.4326, lon: -99.1332, x: lon2x(-99.1332), y: lat2y(19.4326) }
];

// Draw dots and labels for each city using recalculated x/y
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
    const offsetX = city.x < width / 2 ? 15 : -15;
    label.setAttribute("x", city.x + offsetX);
    label.setAttribute("y", city.y + 5);
    label.setAttribute("fill", "#fff");
    label.setAttribute("font-size", "13");
    label.setAttribute("font-family", "monospace");
    label.setAttribute("stroke", "#222");
    label.setAttribute("stroke-width", "0.8");
    label.setAttribute("text-anchor", city.x < width / 2 ? "start" : "end");
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