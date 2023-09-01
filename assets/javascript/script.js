var cityInput = document.getElementById('city-input');
var cityListElement = document.getElementById('city-list');
var saveCityButton = document.getElementById('save-city-button');
var resetCityListButton = document.getElementById('reset-city-list-button');

let cityList = JSON.parse(localStorage.getItem('cityList')) || [];

saveCityButton.addEventListener('click', saveCity);
resetCityListButton.addEventListener('click',resetCityList);

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