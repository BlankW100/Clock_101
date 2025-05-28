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

    // D3 projection setup for 1450x711 SVG
    const width = 1450, height = 711;
    const projection = d3.geoMercator()
        .center([0, 20]) // Center at longitude 0, latitude 20
        .scale(230)      // Adjust scale to fit your SVG
        .translate([width / 2, height / 2]);

    // Cities with lat/lon
    const cities = [
        { name: "New York",      tz: "America/New_York",      lon: -74.006,   lat: 40.7128 },
        { name: "London",        tz: "Europe/London",         lon: -0.1276,   lat: 51.5074 },
        { name: "Tokyo",         tz: "Asia/Tokyo",            lon: 139.6917,  lat: 35.6895 },
        { name: "Sydney",        tz: "Australia/Sydney",      lon: 151.2093,  lat: -33.8688 },
        { name: "Los Angeles",   tz: "America/Los_Angeles",   lon: -118.2437, lat: 34.0522 },
        { name: "Paris",         tz: "Europe/Paris",          lon: 2.3522,    lat: 48.8566 },
        { name: "Dubai",         tz: "Asia/Dubai",            lon: 55.2708,   lat: 25.2048 },
        { name: "Shanghai",      tz: "Asia/Shanghai",         lon: 121.4737,  lat: 31.2304 },
        { name: "Moscow",        tz: "Europe/Moscow",         lon: 37.6173,   lat: 55.7558 },
        { name: "Rio",           tz: "America/Sao_Paulo",     lon: -43.1729,  lat: -22.9068 },
        { name: "Cape Town",     tz: "Africa/Johannesburg",   lon: 18.4241,   lat: -33.9249 },
        { name: "Delhi",         tz: "Asia/Kolkata",          lon: 77.2090,   lat: 28.6139 },
        { name: "Auckland",      tz: "Pacific/Auckland",      lon: 174.7633,  lat: -36.8485 },
        { name: "Anchorage",     tz: "America/Anchorage",     lon: -149.9003, lat: 61.2181 },
        { name: "Honolulu",      tz: "Pacific/Honolulu",      lon: -157.8583, lat: 21.3069 },
        { name: "Cairo",         tz: "Africa/Cairo",          lon: 31.2357,   lat: 30.0444 },
        { name: "Beijing",       tz: "Asia/Shanghai",         lon: 116.4074,  lat: 39.9042 },
        { name: "Singapore",     tz: "Asia/Singapore",        lon: 103.8198,  lat: 1.3521 },
        { name: "Berlin",        tz: "Europe/Berlin",         lon: 13.4050,   lat: 52.5200 },
        { name: "Mexico City",   tz: "America/Mexico_City",   lon: -99.1332,  lat: 19.4326 }
    ];

    // Draw dots and labels for each city using D3 projection
    cities.forEach(city => {
        const [x, y] = projection([city.lon, city.lat]);

        // Create city dot
        const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        dot.setAttribute("cx", x);
        dot.setAttribute("cy", y);
        dot.setAttribute("r", "10");
        dot.setAttribute("fill", "#fff");
        dot.setAttribute("stroke", "#222");
        dot.setAttribute("stroke-width", "2");
        dot.style.cursor = "pointer";
        dot.setAttribute("data-tz", city.tz);
        dot.setAttribute("data-name", city.name);
        svg.appendChild(dot);

        // Label offset: right and slightly above
        const labelDX = 16;
        const labelDY = -12;

        // Create city label
        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", x + labelDX);
        label.setAttribute("y", y + labelDY);
        label.setAttribute("fill", "#222");
        label.setAttribute("font-size", "18");
        label.setAttribute("font-family", "monospace");
        label.setAttribute("text-anchor", "start");
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