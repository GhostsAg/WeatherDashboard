
$(document).ready(function() {
    // ajax request vars
    var cityVar = "";
    const api_key = "bfa2edb3854eb69c605b1ee877b198e2";
    var weatherURL;
    var forecastURL;
    var date = moment().format('MMM Do YY');
    var history;
    
    // index var for local storage
    var cityIndex;

    // elements selectors
    var $forecast = document.querySelectorAll(".card");

    // Functions 
    function loadHist() {
        if (!localStorage.getItem("index")) {
            cityIndex = -1;
            $("#searchHistory").append(`<li>Empty History..</li><hr>`);
            history = false;
        }else {
            $("#searchHistory").empty();
            cityIndex = localStorage.getItem("index");
            for (let i=-1; i<cityIndex; i++) {
                $("#searchHistory").prepend(`<li class="history" type="button">${localStorage.getItem(`City: ${i+1}`)}</li><hr>`);
            }
        }
    }

    function gotHist() {
        if (history==false) {
            $("#searchHistory").empty();
            history = true;
        }
    }

    function icons() {
        // Clear, Clouds, Rain, 
        for (let i=0; i<$forecast.length; i++) {
            var icon = $forecast[i].children[1].getAttribute('data-name');
            if (icon=="Clear") {
                $forecast[i].children[1].setAttribute("class", "fas fa-cloud-sun");
            }
            else if (icon == "Clouds") {
                $forecast[i].children[1].setAttribute("class", "fas fa-cloud");
            }
            else if (icon == "Rain") {
                $forecast[i].children[1].setAttribute("class", "fas fa-cloud-rain");
            }
            else if (icon == "Snow") {
                $forecast[i].children[1].setAttribute("class", "far fa-snowflake")
            }
            else {
                $forecast[i].children[1].setAttribute("class", "fas fa-wrench");  
            }
        }
    }

    loadHist();
    $(".searchBtn").on("click", function() {
        gotHist();
        cityVar = $("#searchBar").val();
        weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityVar}&appid=${api_key}`;
        forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityVar}&appid=${api_key}`;
        
        // Set History
        cityIndex++;
        localStorage.setItem(`City: ${cityIndex}`, `${cityVar}`);
        localStorage.setItem(`index`, `${cityIndex}`);
        var $newCity = $(`<li class="history" type="button">${cityVar}</li>`);
        var $hr = $("<hr>");
        $("#searchHistory").prepend($hr);
        $("#searchHistory").prepend($newCity);
        
        // coords
        var lat = "";
        var lon = "";

        // API calls.
        $.ajax({
            url: weatherURL 
        })
        .then(function(response) {
            lon = response.coord.lon;
            lat = response.coord.lat;
            $("#dispCity").text(`${response.name}  (${date})`);
            var tempF = ((response.main.temp - 273.15) * 9/5 + 32).toPrecision(2);
            var tempC = (response.main.temp - 273.15).toPrecision(2);
            $("#temp").text(`Temperature:  ${tempF}\u00B0F / ${tempC}\u00B0C`);
            $("#humidity").text(`Humidity:  ${response.main.humidity}%`);
            $("#windSpeed").text(`Wind Speed:  ${response.wind.speed} MPH`);

            uviURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${api_key}&lon=${lon}&lat=${lat}`; 
            $.ajax({
                url: uviURL 
            })
            .then(function(newResponse) {
                var uvi = newResponse.value;
                $("#uv").text(uvi);
                if (uvi <= 2) {
                    $("#uv").css("background-color", "green");
                    $("#uv").css("color", "black");
                }
                else if (uvi <= 5) {
                    $("#uv").css("background-color", "yellow");
                    $("#uv").css("color", "black");
                }
                else if (uvi <= 7) {
                    $("#uv").css("background-color", "orange");
                }
                else if (uvi <= 10) {
                    $("#uv").css("background-color", "red");
                }else {
                    $("#uv").css("background-color", "purple");
                }
            });
        });
    
        $.ajax({
            url: forecastURL 
        })
        .then(function(response) {
            for (let i=0; i<$forecast.length; i++) {
                $forecast[i].children[0].textContent = moment().add(i+1, "days").format('MMM Do YY');
                $forecast[i].children[1].setAttribute("data-name", response.list[i*8].weather[0].main);
                var temp = ((response.list[i*8].main.temp - 273.15) * 9/5 + 32).toPrecision(2);
                var humidity = response.list[i*8].main.humidity;
                $forecast[i].children[2].textContent = `Temp: ${temp}\u00B0F`;
                $forecast[i].children[3].textContent = `Humidity: ${humidity}%`;
            }
            icons();
        });
    });

    $(".aside").on("click", ".history", function() {
        cityVar = this.innerHTML;
        weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityVar}&appid=${api_key}`;
        forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityVar}&appid=${api_key}`;
        
        // coords
        var lat = "";
        var lon = "";

        // API calls.
        $.ajax({
            url: weatherURL 
        })
        .then(function(response) {
            lon = response.coord.lon;
            lat = response.coord.lat;
            $("#dispCity").text(`${response.name}  (${date})`);
            var tempF = ((response.main.temp - 273.15) * 9/5 + 32).toPrecision(2);
            var tempC = (response.main.temp - 273.15).toPrecision(2);
            $("#temp").text(`Temperature:  ${tempF}\u00B0F / ${tempC}\u00B0C`);
            $("#humidity").text(`Humidity:  ${response.main.humidity}%`);
            $("#windSpeed").text(`Wind Speed:  ${response.wind.speed} MPH`);

            uviURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${api_key}&lon=${lon}&lat=${lat}`; 
            $.ajax({
                url: uviURL 
            })
            .then(function(newResponse) {
                var uvi = newResponse.value;
                $("#uv").text(uvi);
                if (uvi <= 2) {
                    $("#uv").css("background-color", "green");
                    $("#uv").css("color", "black");
                }
                else if (uvi <= 5) {
                    $("#uv").css("background-color", "yellow");
                    $("#uv").css("color", "black");
                }
                else if (uvi <= 7) {
                    $("#uv").css("background-color", "orange");
                }
                else if (uvi <= 10) {
                    $("#uv").css("background-color", "red");
                }else {
                    $("#uv").css("background-color", "purple");
                }
            });
        });
    
        $.ajax({
            url: forecastURL 
        })
        .then(function(response) {
            for (let i=0; i<$forecast.length; i++) {
                $forecast[i].children[0].textContent = moment().add(i+1, "days").format('MMM Do YY');
                $forecast[i].children[1].setAttribute("data-name", response.list[i*8].weather[0].main);
                var temp = ((response.list[i*8].main.temp - 273.15) * 9/5 + 32).toPrecision(2);
                var humidity = response.list[i*8].main.humidity;
                $forecast[i].children[2].textContent = `Temp: ${temp}\u00B0F`;
                $forecast[i].children[3].textContent = `Humidity: ${humidity}%`;
            }
            icons();
        });
    });
})
