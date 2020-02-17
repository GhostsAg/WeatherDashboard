
$(document).ready(function() {
    // ajax request vars
    var cityVar = "";
    const api_key = "bfa2edb3854eb69c605b1ee877b198e2";
    var weatherURL;
    var forecastURL;
    
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
        });
    
        $.ajax({
            url: forecastURL 
        })
        .then(function(response) {
            console.log(response);
        });
    })

    
})
