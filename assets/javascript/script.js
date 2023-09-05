
$(function () {
//var APIKey = "e8dad390ebbd6c69a9686f2a12eedb94";
//var city;
//var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
//var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}";
var cityInput = document.getElementById('city-input');
var cityListElement = document.getElementById('city-list');
var saveCityButton = document.getElementById('save-city-button');
var resetCityListButton = document.getElementById('reset-city-list-button');
//var currentDate = dayjs().format('MM/DD/YYYY') $('#currentDay').text(currentDate);

let cityList = JSON.parse(localStorage.getItem('cityList')) || [];

saveCityButton.addEventListener('click', saveCity);
resetCityListButton.addEventListener('click',resetCityList);

//fetch(queryURL)

//fetch(forecastURL)

function saveCity(event) {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (city === "") {
        alert('Please enter a city name');
    } else {
        const newCity = { city };

        cityList.push(newCity);
        localStorage.setItem('cityList', JSON.stringify(cityList));
        showCities();
    }
}

function showCities() {
    cityListElement.innerHTML = '';
    cityList.forEach(function(cityObj) {
    var li = document.createElement('li');
    li.textContent = cityObj.city;

    li.classList.add('list-group-item', 'list-group-item-dark', 'text-center', 'mb-2', 'rounded');

    cityListElement.appendChild(li);
    });
}

function resetCityList(event) {
    event.preventDefault();
    localStorage.removeItem('cityList');
    cityList = [];
    showCities();
}

showCities();

});