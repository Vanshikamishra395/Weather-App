const apiKey = "47c9a84c62ddac5465c3deead10024b3";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("city");
const loader = document.getElementById("loader");
const weatherCard = document.getElementById("weatherCard");
const forecastContainer = document.getElementById("forecastContainer");
const forecastList = document.getElementById("forecastList");

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
    }
});

async function getWeatherData(city) {
    loader.classList.remove("hidden");
    weatherCard.classList.add("hidden");
    forecastContainer.classList.add("hidden");

    try {
        // Fetch Current Weather
        const currentRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const currentData = await currentRes.json();
        
        // Fetch Forecast
        const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
        const forecastData = await forecastRes.json();

        if (currentRes.ok && forecastRes.ok) {
            displayCurrentWeather(currentData);
            displayForecast(forecastData);
        } else {
            alert("City not found");
        }
    } catch (error) {
        console.error(error);
    } finally {
        loader.classList.add("hidden");
    }
}

function displayCurrentWeather(data) {
    document.getElementById("cityName").innerText = data.name;
    document.getElementById("temp").innerText = `${Math.round(data.main.temp)}°C`;
    document.getElementById("desc").innerText = data.weather[0].description.toUpperCase();
    document.getElementById("icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    
    // Change background based on weather
    updateBackground(data.weather[0].main);
    weatherCard.classList.remove("hidden");
}

function displayForecast(data) {
    forecastList.innerHTML = "";
    // OpenWeather gives 3-hour chunks, we filter for one per day (12:00 PM)
    const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));

    dailyData.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
        
        forecastList.innerHTML += `
            <div class="forecast-item">
                <p>${dayName}</p>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
                <p><strong>${Math.round(day.main.temp)}°</strong></p>
            </div>
        `;
    });
    forecastContainer.classList.remove("hidden");
}

function updateBackground(status) {
    const body = document.body;
    if (status === "Clear") body.style.background = "linear-gradient(135deg, #fceabb, #f8b500)";
    else if (status === "Clouds") body.style.background = "linear-gradient(135deg, #bdc3c7, #2c3e50)";
    else if (status === "Rain") body.style.background = "linear-gradient(135deg, #4b6cb7, #182848)";
    else body.style.background = "linear-gradient(135deg, #00b4db, #0083b0)";
}