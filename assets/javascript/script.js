
$(function () {
var APIKey = "e8dad390ebbd6c69a9686f2a12eedb94";
var cityInput = document.getElementById('city-input');
var cityWeather = document.getElementById('city-weather');
var cityListElement = document.getElementById('city-list');
var resetCityListButton = document.getElementById('reset-city-list-button');

var cityList = JSON.parse(localStorage.getItem('cityList')) || [];

resetCityListButton.addEventListener('click',resetCityList);

$('#save-city-button').on('click',function(event) {
    event.preventDefault();
    var city = cityInput.value.trim();

    if (city === "") {
        alert('Please enter a city name');
    } else {
        var weatherURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

        fetch(weatherURL)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log("Weather data", data);
                var cityName = data.name;
                var temp = data.main.temp;
                var wind = data.wind.speed;
                var humidity = data.main.humidity;
                var lat = data.coord.lat;
                var lon = data.coord.lon;

                updateCityWeather(cityName, data.weather, temp, wind, humidity);

                var forecastURL = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;

                fetch(forecastURL)
                    .then(function (response){
                        return response.json();
                    })
                    .then(function (forecastData) {
                        console.log("Forecast data", forecastData);
                        for (var i = 0; i < 5; i++) {
                            var forecastItem = forecastData.list[i];
                            var forecastDate = forecastItem.dt_txt;
                            var forecastIconCode = forecastItem.weather[0].icon;
                            var forecastTemp = forecastItem.main.temp;
                            var forecastWind = forecastItem.wind.speed;
                            var forecastHumidity = forecastItem.main.humidity;
                            
                            updateCityForecast(i + 1, forecastDate, forecastIconCode, forecastTemp, forecastWind, forecastHumidity);
                        } 
                    })
                    .catch(function (forecastError) {
                        console.log(forecastError);
                        alert('Error fetching forecast data. Please try again');
                    });
            })
            .catch(function (error) {
                console.log(error);
                alert('Error fetching weather data. Please try again.');
            });
        
        cityList.push({city: city});
        localStorage.setItem('cityList', JSON.stringify(cityList));
        showCities();
    }
});

function updateCityForecast(dayNumber, forecastDate, forecastIconCode, forecastTempKelvin, forecastWind, forecastHumidity) {
    var forecastTempFahrenheit = Math.round((forecastTempKelvin - 273.15) * 9/5 + 32);
    var forecastIconURL = `http://openweathermap.org/img/w/${forecastIconCode}.png`;

    var forecastDayElement = document.getElementById(`Day-${dayNumber}`);

    forecastDayElement.innerHTML = `
        <h4>${forecastDate}</h4>
        <img src="${forecastIconURL}" alt="Weather Icon">
        <h4>Temp: ${forecastTempFahrenheit}°F</h4>
        <h4>Wind: ${forecastWind} MPH</h4>
        <h4>Humidity: ${forecastHumidity}%</h4>
    `;
}

function updateCityWeather(cityName, weatherData, tempKelvin, wind, humidity) {
    var tempFahrenheit = Math.round((tempKelvin - 273.15) * 9/5 + 32);
    var weatherIconCode = weatherData[0].icon;
    var iconURL = `http://openweathermap.org/img/w/${weatherIconCode}.png`;
    cityWeather.innerHTML = `
    <h2>${cityName} ${dayjs().format('M/DD/YYYY')}</h2>
    <img src="${iconURL}" alt="Weather Icon">
    <h4>Temp: ${tempFahrenheit}°F</h4>
    <h4>Wind: ${wind} MPH</h4>
    <h4>Humidity: ${humidity}%</h4>
    `;
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
    cityWeather.innerHTML = `
        <h2>Please enter a city name</h2>
        <h4>Temp: </h4>
        <h4>Wind: </h4>
        <h4>Humidity: </h4>
        `;
    showCities();
}

});