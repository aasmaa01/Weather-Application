
const apiKey= "383f94e1b221da936c5d30b6b15b64da";
const apiUrl="https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";

const searchBox= document.querySelector(".search-bar input");
const searchBtn= document.querySelector(".search-bar button");
const weatherIcon= document.querySelector(".weather-icon img"); 


async function checkWeather(city) {
    const response = await fetch(apiUrl + city +`&appid=${apiKey}`);
    var data = await response.json();

    console.log(data);

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp)+"°C";
    document.querySelector(".humidity").innerHTML = data.main.humidity+"%";
    document.querySelector(".wind").innerHTML = data.wind.speed+"km/h";
    
    const rainVolume = data.rain ? (data.rain["1h"] || 0) : 0;
    document.querySelector(".rain").innerHTML = rainVolume + " mm"; //i don't find itttttt

    if(data.weather[0].main == "Clouds"){
        weatherIcon.src= "images&icons/icons8-cloud-94.png";
    }
    else if(data.weather[0].main == "Clear"){
        weatherIcon.src= "images&icons/icons8-partly-cloudy-day-94.png";
    }
    else if(data.weather[0].main == "Rain"){
        weatherIcon.src= "images&icons/icons8-keep-dry-94.png";
    }
    else if(data.weather[0].main == "Drizzle"){
        weatherIcon.src= "images&icons/icons8-dashing-away-94.png";
    }
    else if(data.weather[0].main == "Mist"){
        weatherIcon.src= "images&icons/icons8-windy-weather-94.png";
    }


    const lat =data.coord.lat;
    const lon =data.coord.lon;
    fetchForecast(lat, lon);
}
async function fetchForecast(lat, lon) {
    const response = await fetch(`${forecastUrl}?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
    const forecastData = await response.json();
    console.log(forecastData);

    displayHourlyForecast(forecastData.list.slice(0, 6));
    displayWeeklyForecast(forecastData.list);//gggggggggggggggggggggggggggggggggggggggggggggggggggggg
}
function displayHourlyForecast(hourlyData){
    const hourlyForecastContainer = document.querySelector(".hourly-forecast");
    hourlyForecastContainer.innerHTML = "";

    hourlyData.slice(0, 6).forEach((hourData, index) => {
        const hourElement = document.createElement("div");
        hourElement.className = "hour";

        const time = new Date(hourData.dt *1000).getHours();
        const temp = Math.round(hourData.temp)+"°C";
        const iconSrc = getIconByCondition(hourData.weather[0].main);

        hourElement.innerHTML = `
            <p>${time}</p>
            <img src="${iconSrc}" alt="${hourData.weather[0].description}">
            <p>${temp}</p>
        `;
        hourlyForecastContainer.appendChild(hourElement);
    });
}
function displayWeeklyForecast(dailyData) {
    const dailyForecastContainer = document.querySelector(".weekly-forecast");
    dailyForecastContainer.innerHTML = "";

    // Create an object to hold daily temperatures and weather conditions
    const dailyForecast = {};

    dailyData.forEach(data => {
        const date = new Date(data.dt * 1000).toLocaleDateString("en-US");
        if (!dailyForecast[date]) {
            dailyForecast[date] = {
                maxTemp: data.main.temp_max,
                minTemp: data.main.temp_min,
                weather: data.weather[0].main,
            };
        } else {
            // Update the max/min temperatures
            dailyForecast[date].maxTemp = Math.max(dailyForecast[date].maxTemp, data.main.temp_max);
            dailyForecast[date].minTemp = Math.min(dailyForecast[date].minTemp, data.main.temp_min);
        }
    });

    // Create HTML elements for each day's forecast
    Object.keys(dailyForecast).forEach(date => {
        const dayData = dailyForecast[date];
        const dayElement = document.createElement("div");
        dayElement.className = "day";

        const temp = `${Math.round(dayData.maxTemp)}/${Math.round(dayData.minTemp)}°C`;
        const iconSrc = getIconByCondition(dayData.weather);

        dayElement.innerHTML = `
            <p>${date}</p>
            <img src="${iconSrc}" alt="${dayData.weather}">
            <p>${temp}</p>
        `;
        dailyForecastContainer.appendChild(dayElement);
    });
}

function getIconByCondition(condition){
    if (condition === "Clouds") return "images&icons/icons8-cloud-94.png";
    if (condition === "Clear") return "images&icons/icons8-partly-cloudy-day-94.png";
    if (condition === "Rain") return "images&icons/icons8-keep-dry-94.png";
    if (condition === "Drizzle") return "images&icons/icons8-dashing-away-94.png";
    if (condition === "Mist") return "images&icons/icons8-windy-weather-94.png";
    return "images&icons/icons8-storm-94.png";
}

searchBtn.addEventListener("click", ()=>{
    checkWeather(searchBox.value);
})