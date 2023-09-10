
$(function () {
    var APIKey = "e8dad390ebbd6c69a9686f2a12eedb94";
    var cityInput = document.getElementById('city-input');
    var cityWeather = document.getElementById('city-weather');
    var cityListElement = document.getElementById('city-list');
    var resetCityListButton = document.getElementById('reset-city-list-button');

    //retrieve a list of cities from local storage
    var cityList = JSON.parse(localStorage.getItem('cityList')) || [];

    resetCityListButton.addEventListener('click', resetCityList);

    //attach a click even to the search button 
    $('#save-city-button').on('click', function (event) {
        event.preventDefault();
        // get the user entered city name
        var city = cityInput.value.trim();

        if (city === "") {
            alert('Please enter a city name');
        } else {
            //Url for fetching current weather data
            var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

            //fetch current weather data from the API 
            fetch(weatherURL)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log("Weather data", data);
                    // extract relevant weather info from the API response i.e. JSON
                    var cityName = data.name;
                    var temp = data.main.temp;
                    var wind = data.wind.speed;
                    var humidity = data.main.humidity;
                    var lat = data.coord.lat;
                    var lon = data.coord.lon;

                    // function to update the displayed current weather
                    updateCityWeather(cityName, data.weather, temp, wind, humidity);

                    // URL for weather forecast data
                    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;

                    // fetch weather forecast data from API
                    fetch(forecastURL)
                        .then(function (response) {
                            return response.json();
                        })
                        .then(function (forecastData) {
                            console.log("Forecast data", forecastData);
                            // process and display the 5-day forecast
                            var dayNumber = 1;
                            for (var i = 0; i < forecastData.list.length; i++) {
                                var forecastItem = forecastData.list[i];
                                if (forecastItem.dt_txt.includes("15:00:00")) {
                                    var forecastDate = forecastItem.dt_txt;
                                    var forecastIconCode = forecastItem.weather[0].icon;
                                    var forecastTemp = forecastItem.main.temp;
                                    var forecastWind = forecastItem.wind.speed;
                                    var forecastHumidity = forecastItem.main.humidity;

                                    //update the html display with the forecast data
                                    updateCityForecast(dayNumber, forecastDate, forecastIconCode, forecastTemp, forecastWind, forecastHumidity, `Day-${dayNumber}`);
                                    dayNumber++;
                                }
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

            //add the searched city to the city list
            cityList.push({ city: city });

            // store the updated city list in local storage
            localStorage.setItem('cityList', JSON.stringify(cityList));

            // display the list of searched cities
            showCities();
        }
    });

    // function to display after the API is fetched
    function updateCityWeather(cityName, weatherData, tempKelvin, wind, humidity) {
        var tempFahrenheit = Math.round((tempKelvin - 273.15) * 9/5 + 32);
        var weatherIconCode = weatherData[0].icon;
        var iconURL = `https://openweathermap.org/img/w/${weatherIconCode}.png`;
        cityWeather.innerHTML = `
        <h2>${cityName} ${dayjs().format('M/DD/YYYY')}</h2>
        <img src="${iconURL}" alt="Weather Icon">
        <h4>Temp: ${tempFahrenheit}°F</h4>
        <h4>Wind: ${wind} MPH</h4>
        <h4>Humidity: ${humidity}%</h4>
        `;
    }

    // function to display after the API is fetched
    function updateCityForecast(dayNumber, forecastDate, forecastIconCode, forecastTempKelvin, forecastWind, forecastHumidity, cardId) {
        var forecastTempFahrenheit = Math.round((forecastTempKelvin - 273.15) * 9/5 + 32);
        var forecastIconURL = `https://openweathermap.org/img/w/${forecastIconCode}.png`;

        var formattedDate = dayjs(forecastDate).format('M/DD/YYYY');

        var forecastDayElement = document.getElementById(cardId);

        if (forecastDayElement) {
            forecastDayElement.innerHTML = `
                <h4>${formattedDate}</h4>
                <img src="${forecastIconURL}" alt="Weather Icon">
                <h4>Temp: ${forecastTempFahrenheit}°F</h4>
                <h4>Wind: ${forecastWind} MPH</h4>
                <h4>Humidity: ${forecastHumidity}%</h4>
            `;
        }
    }

    // function to display the list of searched cities
    function showCities() {
        cityListElement.innerHTML = '';
        var uniqueCities = [];
    
        cityList.forEach(function (cityObj) {
            if (!uniqueCities.includes(cityObj.city)) {
                uniqueCities.push(cityObj.city);
                var li = document.createElement('li');
                var cityButton = document.createElement('button');
                cityButton.textContent = cityObj.city;
                cityButton.classList.add('list-group-item', 'list-group-item-dark', 'text-center', 'mb-2', 'rounded', 'full-width-button');
    
                cityButton.addEventListener('click', function () {
                    cityInput.value = cityObj.city;
                    $(`#save-city-button`).click();
                });
    
                li.appendChild(cityButton);
                cityListElement.appendChild(li);
            }
        });
    }
     
    // function to reset the city list
    function resetCityList(event) {
        event.preventDefault();
        localStorage.removeItem('cityList');
        cityList = [];

        var forecastDays = document.querySelectorAll(".card-container .card");
        forecastDays.forEach(function (forecastDay) {
            forecastDay.innerHTML = `
                <article id="${forecastDay.id}">
                    <h4><br></h4>
                    <h4><br></h4>
                    <h4>Temp: </h4>
                    <h4>Wind: </h4>
                    <h4>Humidity: </h4>
                </article>
            `;
        });

        cityWeather.innerHTML = `
            <h2>Please enter a city name</h2>
            <h4>Temp: </h4>
            <h4>Wind: </h4>
            <h4>Humidity: </h4>
        `;
        showCities();
    }
});

