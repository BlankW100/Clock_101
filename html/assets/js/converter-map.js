import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Your Firebase config here
const firebaseConfig = {
    apiKey: "AIzaSyBiOkxZFBwCP3NOXqZqpit5tF9MnwKaavQ",
    authDomain: "clock-101-10e68.firebaseapp.com",
    projectId: "clock-101-10e68",
    storageBucket: "clock-101-10e68.firebasestorage.app",
    messagingSenderId: "654434052980",
    appId: "1:654434052980:web:d270879ef90c796a059a21",
    measurementId: "G-VHP3DZEB3G"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let favoriteCities = [];

function showUserTimezone() {
    const tz = moment.tz.guess();
    const now = moment().tz(tz);
    const offset = now.format('Z');
    const display = `${tz}  ${now.format('hh:mm a')} UTC${offset}`;
    document.getElementById('user-tz').textContent = display;
}

function getProjectionParams() {
    const lon = 0, lat = 20, scale = 230, tx = 725, ty = 355;
    return { lon, lat, scale, tx, ty };
}

function showFavoriteCitiesTime() {
    const favDiv = document.getElementById('favorite-tz');
    if (!favoriteCities.length) {
        favDiv.textContent = '';
        return;
    }
    favDiv.innerHTML = favoriteCities.map(city => {
        const now = moment().tz(city.tz);
        const offset = now.format('Z');
        return `<span style="color:#ffb300;"><b>★ ${city.name}:</b></span> ${city.tz}  ${now.format('hh:mm a')} UTC${offset}`;
    }).join('<br>');
}

async function saveFavoriteCities() {
    // Save to Firestore under collection "favcity", doc "userfav"
    await setDoc(doc(db, "favcity", "userfav"), { cities: favoriteCities });
}

async function loadFavoriteCities(allCities) {
    const favSnap = await getDoc(doc(db, "favcity", "userfav"));
    if (favSnap.exists()) {
        const fav = favSnap.data();
        if (Array.isArray(fav.cities)) {
            // Map to city objects from allCities for up-to-date info
            favoriteCities = fav.cities.map(favCity =>
                allCities.find(c => c.name === favCity.name) || favCity
            );
        }
        showFavoriteCitiesTime();
    }
}

function isFavorite(city) {
    return favoriteCities.some(c => c.name === city.name);
}

function toggleFavorite(city, allCities) {
    if (isFavorite(city)) {
        favoriteCities = favoriteCities.filter(c => c.name !== city.name);
    } else {
        favoriteCities.push(city);
    }
    showFavoriteCitiesTime();
    saveFavoriteCities();
    drawCities(allCities);
}

function drawCities(allCitiesParam) {
    const svg = document.getElementById('timezone-map');
    Array.from(svg.querySelectorAll('circle,text')).forEach(el => el.remove());

    const { lon, lat, scale, tx, ty } = getProjectionParams();
    const width = 1450, height = 711;
    const projection = d3.geoMercator()
        .center([lon, lat])
        .scale(scale)
        .translate([tx, ty]);

    const cities = allCitiesParam || [
        { name: "New York",      tz: "America/New_York",      lon: -73.9249,  lat: 40.6943 },
        { name: "Beijing",       tz: "Asia/Shanghai",         lon: 116.3975,  lat: 39.9067 },
        { name: "London",        tz: "Europe/London",         lon: -0.1275,   lat: 51.5072 },
        { name: "Tokyo",         tz: "Asia/Tokyo",            lon: 139.7495,  lat: 35.6870 },
        { name: "Sydney",        tz: "Australia/Sydney",      lon: 151.2,     lat: -33.8667 },
        { name: "Los Angeles",   tz: "America/Los_Angeles",   lon: -118.2437, lat: 34.0522 },
        { name: "Paris",         tz: "Europe/Paris",          lon: 2.3522,    lat: 48.8567 },
        { name: "Dubai",         tz: "Asia/Dubai",            lon: 55.2972,   lat: 25.2631 },
        { name: "Shanghai",      tz: "Asia/Shanghai",         lon: 121.4747,  lat: 31.2286 },
        { name: "Moscow",        tz: "Europe/Moscow",         lon: 37.6175,   lat: 55.7506 },
        { name: "Cape Town",     tz: "Africa/Johannesburg",   lon: 18.4239,   lat: -33.9253 },
        { name: "Delhi",         tz: "Asia/Kolkata",          lon: 77.23,     lat: 28.61 },
        { name: "Auckland",      tz: "Pacific/Auckland",      lon: 174.7653,  lat: -36.8492 },
        { name: "Honolulu",      tz: "Pacific/Honolulu",      lon: -157.846,  lat: 21.3294 },
        { name: "Mexico City",   tz: "America/Mexico_City",   lon: -99.1333,  lat: 19.4333 },
        { name: "Berlin",        tz: "Europe/Berlin",         lon: 13.405,    lat: 52.52 },
        { name: "Singapore",     tz: "Asia/Singapore",        lon: 103.8,     lat: 1.3 },
        { name: "Kuala Lumpur",  tz: "Asia/Kuala_Lumpur",     lon: 101.698,   lat: 3.1686 },
        { name: "Bangkok",       tz: "Asia/Bangkok",          lon: 100.4942,  lat: 13.7525 },
        { name: "Jakarta",       tz: "Asia/Jakarta",          lon: 106.8275,  lat: -6.175 }
    ];

    cities.forEach(city => {
        const [x, y] = projection([city.lon, city.lat]);
        let isFav = isFavorite(city);
        let r = isFav ? 11 : 10;
        let fill = isFav ? "#ffeb3b" : "#fff";
        let stroke = isFav ? "#ffb300" : "#222";
        let fontWeight = isFav ? "bold" : "normal";
        let labelColor = isFav ? "#ffb300" : "#222";

        // Dot
        const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        dot.setAttribute("cx", x);
        dot.setAttribute("cy", y);
        dot.setAttribute("r", r);
        dot.setAttribute("fill", fill);
        dot.setAttribute("stroke", stroke);
        dot.setAttribute("stroke-width", "2");
        dot.style.cursor = "pointer";
        dot.setAttribute("data-tz", city.tz);
        dot.setAttribute("data-name", city.name);
        svg.appendChild(dot);

        // Label offset logic
        let labelDX = 16, labelDY = -12, anchor = "start";
        if (x > width * 0.8) { labelDX = -16; anchor = "end"; }
        if (x < width * 0.2) { labelDX = 16; anchor = "start"; }
        if (y < height * 0.15) { labelDY = 20; }
        if (y > height * 0.85) { labelDY = -16; }

        // Label
        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", x + labelDX);
        label.setAttribute("y", y + labelDY);
        label.setAttribute("fill", labelColor);
        label.setAttribute("font-size", "18");
        label.setAttribute("font-family", "monospace");
        label.setAttribute("font-weight", fontWeight);
        label.setAttribute("text-anchor", anchor);
        label.textContent = city.name;
        label.style.cursor = "pointer";
        svg.appendChild(label);

        // Show city time on click (dot or label)
        function showCityTime() {
            const now = moment().tz(city.tz);
            const offset = now.format('Z');
            const cityDisplay = `${city.tz}  ${now.format('hh:mm a')} UTC${offset}`;
            document.getElementById('city-tz').innerHTML = `<span style="color:#000;"><b>${city.name}:</b></span> ${cityDisplay}`;
        }
        dot.addEventListener('click', showCityTime);
        label.addEventListener('click', showCityTime);

        // Toggle favorite on double click
        async function toggleFav() {
            toggleFavorite(city, cities);
        }
        dot.addEventListener('dblclick', toggleFav);
        label.addEventListener('dblclick', toggleFav);
    });

    showFavoriteCitiesTime();
}

function initTimezoneMap() {
    showUserTimezone();
    setInterval(showUserTimezone, 60000);

    const allCities = [
        { name: "New York",      tz: "America/New_York",      lon: -73.9249,  lat: 40.6943 },
        { name: "Beijing",       tz: "Asia/Shanghai",         lon: 116.3975,  lat: 39.9067 },
        { name: "London",        tz: "Europe/London",         lon: -0.1275,   lat: 51.5072 },
        { name: "Tokyo",         tz: "Asia/Tokyo",            lon: 139.7495,  lat: 35.6870 },
        { name: "Sydney",        tz: "Australia/Sydney",      lon: 151.2,     lat: -33.8667 },
        { name: "Los Angeles",   tz: "America/Los_Angeles",   lon: -118.2437, lat: 34.0522 },
        { name: "Paris",         tz: "Europe/Paris",          lon: 2.3522,    lat: 48.8567 },
        { name: "Dubai",         tz: "Asia/Dubai",            lon: 55.2972,   lat: 25.2631 },
        { name: "Shanghai",      tz: "Asia/Shanghai",         lon: 121.4747,  lat: 31.2286 },
        { name: "Moscow",        tz: "Europe/Moscow",         lon: 37.6175,   lat: 55.7506 },
        { name: "Cape Town",     tz: "Africa/Johannesburg",   lon: 18.4239,   lat: -33.9253 },
        { name: "Delhi",         tz: "Asia/Kolkata",          lon: 77.23,     lat: 28.61 },
        { name: "Auckland",      tz: "Pacific/Auckland",      lon: 174.7653,  lat: -36.8492 },
        { name: "Honolulu",      tz: "Pacific/Honolulu",      lon: -157.846,  lat: 21.3294 },
        { name: "Mexico City",   tz: "America/Mexico_City",   lon: -99.1333,  lat: 19.4333 },
        { name: "Berlin",        tz: "Europe/Berlin",         lon: 13.405,    lat: 52.52 },
        { name: "Singapore",     tz: "Asia/Singapore",        lon: 103.8,     lat: 1.3 },
        { name: "Kuala Lumpur",  tz: "Asia/Kuala_Lumpur",     lon: 101.698,   lat: 3.1686 },
        { name: "Bangkok",       tz: "Asia/Bangkok",          lon: 100.4942,  lat: 13.7525 },
        { name: "Jakarta",       tz: "Asia/Jakarta",          lon: 106.8275,  lat: -6.175 }
    ];

    loadFavoriteCities(allCities).then(() => drawCities(allCities));
}

document.addEventListener('DOMContentLoaded', initTimezoneMap);
