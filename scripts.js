const apiKey = "7890fd97fa9a530f3159fe3ec8da1775";
const searchInput = document.getElementById("searchInput");

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
    const geocodingUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
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
          const iconUrl = `http://openweathermap.org/img/wn/${dailyWeather.weather[0].icon}.png`;
          const minTemp = dailyWeather.temp.min;
          const maxTemp = dailyWeather.temp.max;
          dailyWeatherElement.innerHTML = `<p>${dayName}</p>
          <img src="${iconUrl}" alt="${dailyWeather.weather[0].description}">
          <p>${Math.round(minTemp)}°C / ${Math.round(maxTemp)}°C</p>
        `;
        }
      })
      .catch((error) => console.error(error));
  }
});
