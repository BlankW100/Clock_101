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
        { name: "New York",      tz: "America/New_York",      lon: -73.9249,  lat: 40.6943 },
        { name: "Beijing",       tz: "Asia/Shanghai",         lon: 116.3975,  lat: 39.9067 },
        { name: "London",        tz: "Europe/London",         lon: -0.1275,   lat: 51.5072 },
        { name: "Tokyo",         tz: "Asia/Tokyo",            lon: 139.7495,  lat: 35.6870 },
        { name: "Sydney",        tz: "Australia/Sydney",      lon: 151.2000,  lat: -33.8667 },
        { name: "Los Angeles",   tz: "America/Los_Angeles",   lon: -118.2437, lat: 34.0522 },
        { name: "Paris",         tz: "Europe/Paris",          lon: 2.3522,    lat: 48.8567 },
        { name: "Dubai",         tz: "Asia/Dubai",            lon: 55.2972,   lat: 25.2631 },
        { name: "Shanghai",      tz: "Asia/Shanghai",         lon: 121.4747,  lat: 31.2286 },
        { name: "Moscow",        tz: "Europe/Moscow",         lon: 37.6175,   lat: 55.7506 },
        { name: "Cape Town",     tz: "Africa/Johannesburg",   lon: 18.4239,   lat: -33.9253 },
        { name: "Delhi",         tz: "Asia/Kolkata",          lon: 77.2300,   lat: 28.6100 },
        { name: "Auckland",      tz: "Pacific/Auckland",      lon: 174.7653,  lat: -36.8492 },
        { name: "Honolulu",      tz: "Pacific/Honolulu",      lon: -157.8460, lat: 21.3294 },
        { name: "Mexico City",   tz: "America/Mexico_City",   lon: -99.1333,  lat: 19.4333 },
        { name: "Berlin",        tz: "Europe/Berlin",         lon: 13.4050,   lat: 52.5200 },
        { name: "Singapore",     tz: "Asia/Singapore",        lon: 103.8000,  lat: 1.3000 },
        { name: "Kuala Lumpur",  tz: "Asia/Kuala_Lumpur",     lon: 101.6980,  lat: 3.1686 },
        { name: "Bangkok",       tz: "Asia/Bangkok",          lon: 100.4942,  lat: 13.7525 },
        { name: "Jakarta",       tz: "Asia/Jakarta",          lon: 106.8275,  lat: -6.1750 }
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
