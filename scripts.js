const apiKey = "7890fd97fa9a530f3159fe3ec8da1775";
const searchInput = document.getElementById("searchInput");
let temperatureUnit = "metric";

const getDayName = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayIndex = date.getDay();
  return dayNames[dayIndex];
};
searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    const city = searchInput.value;
    const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    fetch(geocodingUrl)
      .then((response) => response.json())
      .then((data) => {
        const { lat, lon } = data[0];
        const oneCallUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        return fetch(oneCallUrl);
      })
      .then((response) => response.json())
      .then((data) => {
        const dailyWeatherElements = document.querySelectorAll(".dailyWeather");
        for (let i = 0; i < dailyWeatherElements.length; i += 1) {
          const dailyWeather = data.daily[i];
          const dailyWeatherElement = dailyWeatherElements[i];
          const dayName = getDayName(dailyWeather.dt);
          const iconUrl = `https://openweathermap.org/img/wn/${dailyWeather.weather[0].icon}.png`;
          const minTemp = dailyWeather.temp.min;
          const maxTemp = dailyWeather.temp.max;
          dailyWeatherElement.innerHTML = `<p>${dayName}</p>
          <img src="${iconUrl}" alt="${dailyWeather.weather[0].description}">
          <p>${Math.round(minTemp)}°C / ${Math.round(maxTemp)}°C</p>
        `;
        }

        const currentIconElement = document.getElementById("currentIcon");
        const currentDescriptionElement =
          document.getElementById("currentDescription");
        const currentTempElement = document.getElementById("currentTemp");

        const currentDateTimeElement =
          document.getElementById("currentDateTime");
        const currentLocationElement =
          document.getElementById("currentLocation");
        const currentWeather = data.current;

        const celsiusButton = document.getElementById("buttonCelsius");
        const fahrenheitButton = document.getElementById("buttonFahrenheit");

        function getTemperatureString(temp) {
          if (temperatureUnit === "metric") {
            return `${Math.round(temp)}°C`;
          }
          return `${Math.round(temp * 1.8 + 32)}°F`;
        }
        function updateCurrentWeather() {
          currentTempElement.innerHTML = `${getTemperatureString(
            currentWeather.temp
          )}`;
        }

        function updateDailyWeather(daily) {
          for (let i = 0; i < dailyWeatherElements.length; i += 1) {
            const dailyWeather = daily[i];
            const dailyWeatherElement = dailyWeatherElements[i];
            const dayName = getDayName(dailyWeather.dt);
            const iconUrl = `https://openweathermap.org/img/wn/${dailyWeather.weather[0].icon}.png`;
            const minTemp = dailyWeather.temp.min;
            const maxTemp = dailyWeather.temp.max;
            const tempString = `${getTemperatureString(
              minTemp
            )} / ${getTemperatureString(maxTemp)}`;
            dailyWeatherElement.innerHTML = `<p>${dayName}</p>
            <img src="${iconUrl}" alt="${dailyWeather.weather[0].description}">
            <p>${tempString}</p>`;
          }
        }
        celsiusButton.addEventListener("click", () => {
          temperatureUnit = "metric";
          updateDailyWeather(data.daily);
          updateCurrentWeather();
        });

        fahrenheitButton.addEventListener("click", () => {
          temperatureUnit = "imperial";
          updateDailyWeather(data.daily);
          updateCurrentWeather();
        });

        const humidityElement = document.getElementById("humidity");
        humidityElement.textContent = `${currentWeather.humidity}%`;
        document.getElementById("currentHumidity").classList.remove("hidden");

        const pressureElement = document.getElementById("pressure");
        pressureElement.textContent = `${currentWeather.pressure} hPa`;
        document.getElementById("currentPressure").classList.remove("hidden");

        const windSpeedElement = document.getElementById("windSpeed");
        windSpeedElement.textContent = `${currentWeather.wind_speed} m/s`;
        document.getElementById("currentWindSpeed").classList.remove("hidden");

        const uvIndexElement = document.getElementById("uvIndex");
        uvIndexElement.textContent = currentWeather.uvi;
        document.getElementById("currentUVIndex").classList.remove("hidden");

        const iconUrl = `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png`;
        currentIconElement.setAttribute("src", iconUrl);
        currentIconElement.setAttribute(
          "alt",
          currentWeather.weather[0].description
        );
        currentDescriptionElement.innerHTML =
          data.current.weather[0].description;
        currentTempElement.innerHTML = `${Math.round(
          currentWeather.temp
        )}<span data-unit="metric">°C</span>`;
        const date = new Date(currentWeather.dt * 1000);
        const options = { weekday: "long", hour: "numeric", minute: "numeric" };
        currentDateTimeElement.innerHTML = date.toLocaleDateString(
          "en-US",
          options
        );
        currentLocationElement.innerHTML = city;
      })
      .catch((error) => console.error(error));
  }
});
