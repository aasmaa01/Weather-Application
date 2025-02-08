const apiKey = "383f94e1b221da936c5d30b6b15b64da";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

const searchBox = document.querySelector(".search-bar input");
const searchBtn = document.querySelector(".search-bar button");
const weatherIcon = document.querySelector(".weather-icon img");

async function checkWeather(city) {
    try {
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
        if (!response.ok) throw new Error("City not found");
        const data = await response.json();

        updateCurrentWeather(data);

        const forecastResponse = await fetch(forecastUrl + city + `&appid=${apiKey}`);
        if (!forecastResponse.ok) throw new Error("Forecast data not available");
        const forecastData = await forecastResponse.json();

        displayHourlyForecast(forecastData.list.slice(0, 6)); // Next 6 hours
        displayWeeklyForecast(forecastData.list); // Next 7 days
    } catch (error) {
        console.error("Error fetching weather data:", error);
        document.querySelector(".error").style.display = "block";
    }
}

function updateCurrentWeather(data) {
    document.querySelector(".city").textContent = data.name;
    document.querySelector(".temp").textContent = `${Math.round(data.main.temp)}°C`;
    document.querySelector(".humidity").textContent = `${data.main.humidity}%`;
    document.querySelector(".wind").textContent = `${data.wind.speed} km/h`;

    const rainVolume = data.rain ? (data.rain["1h"] || 0) : 0;
    document.querySelector(".rain").textContent = `${rainVolume} mm`;

    weatherIcon.src = getIconByCondition(data.weather[0].main);
    document.querySelector(".error").style.display = "none";
}

// Function to display hourly forecast
function displayHourlyForecast(hourlyData) {
    const hourlyForecastContainer = document.querySelector(".hourly-forecast");
    hourlyForecastContainer.innerHTML = hourlyData
        .map((hourData) => {
            const time = new Date(hourData.dt * 1000).toLocaleTimeString([], { hour: "2-digit" });
            const temp = Math.round(hourData.main.temp);
            const iconSrc = getIconByCondition(hourData.weather[0].main);

            return `
                <div class="hour">
                    <p>${time}</p>
                    <img src="${iconSrc}" alt="${hourData.weather[0].description}">
                    <p>${temp}°C</p>
                </div>
            `;
        })
        .join("");
}

function displayWeeklyForecast(dailyData) {
    const dailyForecastContainer = document.querySelector(".weekly-forecast .days");
    const dailyForecast = {};

    dailyData.forEach((data) => {
        const date = new Date(data.dt * 1000).toLocaleDateString("en-US", { weekday: "short" });
        if (!dailyForecast[date]) {
            dailyForecast[date] = {
                maxTemp: data.main.temp_max,
                minTemp: data.main.temp_min,
                weather: data.weather[0].main,
            };
        } else {
            dailyForecast[date].maxTemp = Math.max(dailyForecast[date].maxTemp, data.main.temp_max);
            dailyForecast[date].minTemp = Math.min(dailyForecast[date].minTemp, data.main.temp_min);
        }
    });

    dailyForecastContainer.innerHTML = Object.keys(dailyForecast)
        .map((date) => {
            const dayData = dailyForecast[date];
            const temp = `${Math.round(dayData.maxTemp)}/${Math.round(dayData.minTemp)}°C`;
            const iconSrc = getIconByCondition(dayData.weather);

            return `
                <div class="day">
                    <p>${date}</p>
                    <img src="${iconSrc}" alt="${dayData.weather}">
                    <p>${temp}</p>
                </div>
            `;
        })
        .join("");
}

// Function to get icon based on weather condition
function getIconByCondition(condition) {
    const iconMap = {
        Clouds: "images&icons/icons8-cloud-94.png",
        Clear: "images&icons/icons8-partly-cloudy-day-94.png",
        Rain: "images&icons/icons8-keep-dry-94.png",
        Drizzle: "images&icons/icons8-dashing-away-94.png",
        Mist: "images&icons/icons8-windy-weather-94.png",
    };
    return iconMap[condition] || "images&icons/icons8-storm-94.png";
}

searchBtn.addEventListener("click", () => {
    if (searchBox.value.trim()) {
        checkWeather(searchBox.value.trim());
    }
});

searchBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && searchBox.value.trim()) {
        checkWeather(searchBox.value.trim());
    }
});

checkWeather("Algiers");
