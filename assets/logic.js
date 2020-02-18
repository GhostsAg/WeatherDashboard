
$(document).ready(function() {
    // ajax request vars
    var cityVar = "";
    var lat = "";
    var lon = "";
    const api_key = "bfa2edb3854eb69c605b1ee877b198e2";
    var weatherURL;
    var forecastURL;
    var date = moment().format('MMM Do YY');
    
    // index var for local storage
    var cityIndex;

    // elements selectors
    var history;


    function loadHist() {
        if (!localStorage.getItem("index")) {
            cityIndex = -1;
            $("#searchHistory").append(`<li>Empty History..</li><hr>`);
            history = false;
        }else {
            $("#searchHistory").empty();
            cityIndex = localStorage.getItem("index");
            for (let i=-1; i<cityIndex; i++) {
                $("#searchHistory").append(`<li>${localStorage.getItem(`City: ${i+1}`)}</li><hr>`);
            }
        }
    }

    function gotHist() {
        if (history==false) {
            $("#searchHistory").empty();
            history = true;
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
        var $newCity = $(`<li>${cityVar}</li>`);
        var $hr = $("<hr>");
        $("#searchHistory").append($newCity);
        $("#searchHistory").append($hr);

        // API calls.
        $.ajax({
            url: weatherURL 
        })
        .then(function(response) {
            console.log(response);
            console.log(response.coord.lat);
            lon = response.coord.lon;
            lat = response.coord.lat;
            $("#dispCity").text(`${response.name}  (${date})`);
            var tempF = ((response.main.temp - 273.15) * 9/5 + 32).toPrecision(2);
            var tempC = (response.main.temp - 273.15).toPrecision(2);
            $("#temp").text(`Temperature:  ${tempF}\u00B0F / ${tempC}\u00B0C`);
            $("#humidity").text(`Humidity:  ${response.main.humidity}%`);
            $("#windSpeed").text(`Wind Speed:  ${response.wind.speed} MPH`);
        });

        uviURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${api_key}&lon=${lon}&lat=${lat}`; 
        $.ajax({
            url: uviURL 
        })
        .then(function(response) {
            console.log(response);
            $("#uv").text(`UV Index:  ${reponse.value}`);
        });
    
        $.ajax({
            url: forecastURL 
        })
        .then(function(response) {
            console.log(response);
        });
    });

    
})
