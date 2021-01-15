var APIkey="";
var queryurl ="";
var currenturl = "";
var url="";
var city=""; 
var citiesDiv = document.getElementById("searched_cities_container");
var cities = []; 

function getCities(){
    var saved_cities = JSON.parse(localStorage.getItem("cities"));
    if (saved_cities !== null){
        cities = saved_cities
    }   
    renderButtons(); 
}
getCities();

function renderButtons(){
    citiesDiv.innerHTML = ""; 
    if(cities == null){
        return;
    }
    var unique_cities = [...new Set(cities)];
    for(var i=0; i < unique_cities.length; i++){
        var cityName = unique_cities[i]; 

        var buttonEl = document.createElement("button");
        buttonEl.textContent = cityName; 
        buttonEl.setAttribute("class", "listbtn"); 

        citiesDiv.appendChild(buttonEl);
        listClick();
      }
    }


function storeCity(){
    localStorage.setItem("cities", JSON.stringify(cities)); 
}

function APIcall(){
    url = "https://api.openweathermap.org/data/2.5/forecast?q=";    
    currenturl = "https://api.openweathermap.org/data/2.5/weather?q=";
    APIkey = "&appid=1c0013a6caf9709b7e6aa371de37246a";
    queryurl = url + city + APIkey;
    current_weather_url = currenturl + city + APIkey; 
    
    $("#name_of_city").text("Today's Weather in " + city);
    $.ajax({
        url: queryurl,
        method: "GET",    
    }).then(function(response){
        var day_number = 0; 
        for(var i=0; i< response.list.length; i++){            
            if(response.list[i].dt_txt.split(" ")[1] == "15:00:00")
            {
                var day = response.list[i].dt_txt.split("-")[2].split(" ")[0];
                var month = response.list[i].dt_txt.split("-")[1];
                var year = response.list[i].dt_txt.split("-")[0];
                $("#" + day_number + "date").text(month + "/" + day + "/" + year); 
                var temp = Math.round(((response.list[i].main.temp - 273.15) *9/5+32));
                $("#" + day_number + "five_day_temp").text("Temp: " + temp + String.fromCharCode(176)+"F");
                $("#" + day_number + "five_day_humidity").text("Humidity: " + response.list[i].main.humidity);
                $("#" + day_number + "five_day_icon").attr("src", "http://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
                day_number++; 
                        }   
        }
    });

     $.ajax({
         url:current_weather_url,
         method: "GET", 
     }).then(function(current_data){
         var temp = Math.round(((current_data.main.temp - 273.15) * 9/5 + 32))
         $("#today_temp").text("Temperature: " + temp + String.fromCharCode(176)+"F");
         $("#today_humidity").text("Humidity: " + current_data.main.humidity);
         $("#today_wind_speed").text("Wind Speed: " + current_data.wind.speed);
         $("#today_icon_div").attr({"src": "http://openweathermap.org/img/w/" + current_data.weather[0].icon + ".png",
          "height": "100px", "width":"100px"});
     })
}

function listClick(){
$(".listbtn").on("click", function(event){
    event.preventDefault();
    city = $(this).text().trim();
    APIcall(); 
})
}
listClick(); 

function searchClick() {
$("#searchButton").on("click", function(event){
    event.preventDefault();
    city = $(this).prev().val().trim()
 
    cities.push(city);
    if(cities.length > 8){
        cities.shift()
    }
    if (city == ""){
        return; 
    }
    APIcall();
    storeCity(); 
    renderButtons();
})
}
searchClick();
