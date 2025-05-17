const apiKey = 'c2c8b1e52469b7702763b40130c49c6f'; // Replace with your OpenWeatherMap API key

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherDisplay = document.getElementById('weatherDisplay');
const forecastCards = document.getElementById('forecastCards');
const historyList = document.getElementById('historyList');

// Fetch current weather data
async function getCurrentWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('City not found');
  return res.json();
}

// Fetch 5-day forecast data
async function getForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Forecast not found');
  return res.json();
}

// Render current weather info
function renderCurrentWeather(data) {
  weatherDisplay.innerHTML = `
    <h4>${data.name} (${new Date().toLocaleDateString()})</h4>
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="weather icon" />
    <p>Temp: ${data.main.temp} °C</p>
    <p>Wind: ${data.wind.speed} m/s</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>${data.weather[0].description}</p>
  `;
}

// Render 5-day forecast cards
function renderForecast(data) {
  // The forecast API returns data every 3 hours. We want one per day around midday.
  forecastCards.innerHTML = '';
  
  // Filter for forecast at 12:00:00 each day
  const noonForecasts = data.list.filter(item => item.dt_txt.includes("12:00:00"));
  
  noonForecasts.forEach(day => {
    const date = new Date(day.dt_txt).toLocaleDateString();
    const card = document.createElement('div');
    card.classList.add('forecast-card');
    card.innerHTML = `
      <h5>${date}</h5>
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" />
      <p>Temp: ${day.main.temp} °C</p>
      <p>Wind: ${day.wind.speed} m/s</p>
      <p>Humidity: ${day.main.humidity}%</p>
      <p>${day.weather[0].description}</p>
    `;
    forecastCards.appendChild(card);
  });
}

// Save search history to localStorage
function saveToHistory(city) {
  let history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
  if (!history.includes(city)) {
    history.push(city);
    localStorage.setItem('weatherHistory', JSON.stringify(history));
    renderHistory();
  }
}

// Render search history list
function renderHistory() {
  let history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
  historyList.innerHTML = '';
  history.slice().reverse().forEach(city => {
    const li = document.createElement('li');
    li.textContent = city;
    li.style.cursor = 'pointer';
    li.addEventListener('click', () => {
      cityInput.value = city;
      searchWeather(city);
    });
    historyList.appendChild(li);
  });
}

// Main function to get weather and forecast
async function searchWeather(city) {
  try {
    const current = await getCurrentWeather(city);
    renderCurrentWeather(current);
    
    const forecast = await getForecast(city);
    renderForecast(forecast);
    
    saveToHistory(city);
  } catch (error) {
    weatherDisplay.innerHTML = `<p>${error.message}</p>`;
    forecastCards.innerHTML = '';
  }
}

// Event listener on search button
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();{
const cityWithCountry = `${city},IN`;  // Append your country code here
searchWeather(cityWithCountry);
  }
});

// Load search history on page load
window.onload = renderHistory;
