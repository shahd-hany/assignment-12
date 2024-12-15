//^ HTML Elements
const searchInput = document.querySelector(".search-input");
// Today
let todayName = document.querySelector(".today-name");
let todayDate = document.querySelector(".today-date");
let todayLocation = document.querySelector(".today-location");
let todayDegree = document.querySelector(".today-degree");
let todayStateImg = document.querySelector(".today-state-img");
let todayStateTxt = document.querySelector(".today-state-txt");
let humidity = document.querySelector(".humidity");
let wind = document.querySelector(".wind");
let windDirection = document.querySelector(".wind-direction");

// Tomorrow, After Tomorrow
let afterName = document.getElementsByClassName("after-day");
let afterStateImg = document.getElementsByClassName("after-state-img");
let afterMaxDegree = document.getElementsByClassName("after-max-deg");
let afterMinDegree = document.getElementsByClassName("after-min-dag");
let afterStateTxt = document.getElementsByClassName("after-state");

//^ App variables
const defaultCity = "Cairo";
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Functions
async function getWeather(query) {
    let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=db9e16b8d2534e7fae4172202241110&q=${query}&days=3`);
    let data = await response.json();
    return data;
}
// Display today's weather
function displayTodayData(data) {
    let date = new Date(data.forecast.forecastday[0].date);
    let dayIndex = date.getDay();
    let dayName = days[dayIndex];
    let monthIndex = date.getMonth();
    let dayNum = date.getDate();
    let monthName = monthNames[monthIndex];
    todayName.innerHTML = dayName;
    todayDate.innerHTML = dayNum + " " + monthName;
    todayLocation.innerHTML = data.location.name;
    todayDegree.innerHTML = data.current.temp_c + "°C";
    todayStateImg.setAttribute("src", data.current.condition.icon);
    todayStateTxt.innerHTML = data.current.condition.text;
    humidity.innerHTML = data.current.humidity + "%";
    wind.innerHTML = data.current.wind_kph + " km/h";
    windDirection.innerHTML = data.current.wind_dir;
}
// Display forecast for upcoming days
function displayAfterData(data) {
    let todayDate = new Date(data.forecast.forecastday[0].date);
    let today = todayDate.getDay();
    for (let i = 0; i < 2; i++) {
        let nextDayIndex = (today + i + 1) % 7;
        afterName[i].innerHTML = days[nextDayIndex];
        afterStateImg[i].setAttribute("src", data.forecast.forecastday[i + 1].day.condition.icon);
        afterMaxDegree[i].innerHTML = data.forecast.forecastday[i + 1].day.maxtemp_c + "°C";
        afterMinDegree[i].innerHTML = data.forecast.forecastday[i + 1].day.mintemp_c + "°C";
        afterStateTxt[i].innerHTML = data.forecast.forecastday[i + 1].day.condition.text;
    }
}
// Get user location using Geolocation API
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } 
    else {
        runFunctions(defaultCity);
    }
}

// Success callback for geolocation
function success(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let query = `${lat},${lon}`; 
    runFunctions(query);
}
function error() {
    runFunctions(defaultCity);
}
async function runFunctions(query) {
    let countryName = searchInput.value ? searchInput.value : query || defaultCity;
    let weatherData = await getWeather(countryName);
    if (!weatherData.error) {
        displayTodayData(weatherData);
        displayAfterData(weatherData);
    } 
}

getUserLocation();  
runFunctions(searchInput.value);
//^ Events
searchInput.addEventListener("input", () => runFunctions(searchInput.value));  
