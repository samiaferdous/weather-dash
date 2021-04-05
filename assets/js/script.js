// DECLARE VARIABLES
var cities = [];

var cityFormEl=document.querySelector("#city-search-form");
var cityInputEl=document.querySelector("#city");
var weatherContainerEl=document.querySelector("#current-weather-container");
var citySearchInputEl = document.querySelector("#searched-city");
var forecastTitle = document.querySelector("#forecast");
var forecastContainerEl = document.querySelector("#fiveday-container");
var pastSearchButtonEl = document.querySelector("#past-search-buttons");

// SEARCH BAR

var formSumbitHandler = function(event){
    event.preventDefault();
    var city = cityInputEl.value.trim();
    if(city){
        getCityWeather(city);
        get5Day(city);
        cities.unshift({city});
        cityInputEl.value = "";
    } else{
        alert("Please enter a City");
    }
    saveSearch();
    pastSearch(city);
}

// SAVE SEARCH TO LOCAL STORAGE
var saveSearch = function(){
    localStorage.setItem("cities", JSON.stringify(cities));
};

// FETCH WEATHER API
var getCityWeather = function(city){
    var apiKey = "844421298d794574c100e3409cee0499"
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayWeather(data, city);
        });
    });
};

// DISPLAY WEATHER
var displayWeather = function(weather, searchCity){
    //clear old content
    weatherContainerEl.textContent= "";  
    citySearchInputEl.textContent=searchCity;

 
//DATE ELEMENT
    var currentDate = document.createElement("span")
    currentDate.textContent=" (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
    citySearchInputEl.appendChild(currentDate);
 
// IMAGE ELEMENT
    var weatherIcon = document.createElement("img")
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
    citySearchInputEl.appendChild(weatherIcon);
 
//SPAN ELEMENT
    var temperatureEl = document.createElement("span");
    temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
    temperatureEl.classList = "list-group-item"

//HUMIDITY
    var humidityEl = document.createElement("span");
    humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
    humidityEl.classList = "list-group-item"
 
//WIND SPEED
    var windSpeedEl = document.createElement("span");
    windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
    windSpeedEl.classList = "list-group-item"
 
    //append to container
    weatherContainerEl.appendChild(temperatureEl);
 
    //append to container
    weatherContainerEl.appendChild(humidityEl);
 
    //append to container
    weatherContainerEl.appendChild(windSpeedEl);
 
    var lat = weather.coord.lat;
    var lon = weather.coord.lon;
    getUvIndex(lat,lon)
 }
 
 //UV INDEX
 var getUvIndex = function(lat,lon){
     var apiKey = "844421298d794574c100e3409cee0499"
     var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
     fetch(apiURL)
     .then(function(response){
         response.json().then(function(data){
             displayUvIndex(data)
            // console.log(data)
         });
     });
 }
  
 var displayUvIndex = function(index){
     var uvIndexEl = document.createElement("div");
     uvIndexEl.textContent = "UV Index: "
     uvIndexEl.classList = "list-group-item"
 
     uvIndexValue = document.createElement("span")
     uvIndexValue.textContent = index.value
 
     if(index.value <=2){
         uvIndexValue.classList = "favorable"
     }else if(index.value >2 && index.value<=8){
         uvIndexValue.classList = "moderate "
     }
     else if(index.value >8){
         uvIndexValue.classList = "severe"
     };
 
     uvIndexEl.appendChild(uvIndexValue);
 
     //append index to current weather
     weatherContainerEl.appendChild(uvIndexEl);
 }
 
 var get5Day = function(city){
     var apiKey = "844421298d794574c100e3409cee0499"
     var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`
 
     fetch(apiURL)
     .then(function(response){
         response.json().then(function(data){
            display5Day(data);
         });
     });
 };
 
 var display5Day = function(weather){
     forecastContainerEl.textContent = ""
     forecastTitle.textContent = "5-Day Forecast:";
 
     var forecast = weather.list;
         for(var i=5; i < forecast.length; i=i+8){
        var dailyForecast = forecast[i];
         
        
        var forecastEl=document.createElement("div");
        forecastEl.classList = "card bg-primary text-light m-2";
 
        var forecastDate = document.createElement("h5")
        forecastDate.textContent= moment.unix(dailyForecast.dt).format("MMM D, YYYY");
        forecastDate.classList = "card-header text-center"
        forecastEl.appendChild(forecastDate);
 
        
        var weatherIcon = document.createElement("img")
        weatherIcon.classList = "card-body text-center";
        weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);  
 
        forecastEl.appendChild(weatherIcon);
        
        var forecastTempEl=document.createElement("span");
        forecastTempEl.classList = "card-body text-center";
        forecastTempEl.textContent = dailyForecast.main.temp + " °F";
 
         forecastEl.appendChild(forecastTempEl);
 
        var forecastHumEl=document.createElement("span");
        forecastHumEl.classList = "card-body text-center";
        forecastHumEl.textContent = dailyForecast.main.humidity + "  %";
 
        forecastEl.appendChild(forecastHumEl);
 
         forecastContainerEl.appendChild(forecastEl);
     }
 
 }
 
 // PAST SEARCH
 var pastSearch = function(pastSearch){
 
     pastSearchEl = document.createElement("button");
     pastSearchEl.textContent = pastSearch;
     pastSearchEl.classList = "d-flex w-100 btn-light border p-2";
     pastSearchEl.setAttribute("data-city",pastSearch)
     pastSearchEl.setAttribute("type", "submit");
 
     pastSearchButtonEl.prepend(pastSearchEl);
 }
 
 
 var pastSearchHandler = function(event){
     var city = event.target.getAttribute("data-city")
     if(city){
         getCityWeather(city);
         get5Day(city);
     }
 }
 
 cityFormEl.addEventListener("submit", formSumbitHandler);
 pastSearchButtonEl.addEventListener("click", pastSearchHandler);
 