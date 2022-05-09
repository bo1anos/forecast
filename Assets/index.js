var apikey='6b02e379b469a3bf13ba75d43508b337';
var input= document.getElementById('search');
var btn= document.getElementById('searchform');
//current day card where our data will go
var cityName = document.getElementById('cityname');
var currentInfo = document.getElementById('info');
var currentTemp = document.getElementById('temp');
var currentWind = document.getElementById('wind');
var currentHum = document.getElementById('hum');
var currentUvi = document.getElementById('uvi');
var currentIcon = document.getElementById('icon');

var iconurl =document.createElement('img');
//future storage for our forecast
var forecast =[
    document.getElementById('day2'),
    document.getElementById('day3'),
    document.getElementById('day4'),
    document.getElementById('day5'),
    document.getElementById('day6'),
];
//our empty future stored items
var prevsearch=[
    document.getElementById('search1'),
    document.getElementById('search2'),
    document.getElementById('search3'),
    document.getElementById('search4'),
    document.getElementById('search5'),
    document.getElementById('search6'),
    document.getElementById('search7'),

];
//allows us to access our local storage data
var cityhistory= JSON.parse(localStorage.getItem('cities'))||[];

function getweather(city){
  //making our api inot a variable for our fetch call
    var weather ="https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apikey;
fetch(weather)
  .then(function (response) {
    //if not able to find the city or problems with our api dealing with a 404
    if (response.status === 404) {
      alert("cant find that city");
    }
    if (city === "") {
      alert("search any city in the world you would like to see");
    } else {
      return response.json();
    }
  })
  .then(function (data) {
    console.log(data);
    //formatting dates and using our api to find our icons to add to our page
    cityName.textContent = data.name + " " + moment().format("MM/DD/YYYY");
    iconurl.src = "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
    var lat = data.coord.lat;
    var lon = data.coord.lon;
    var onecall ="https://api.openweathermap.org/data/2.5/onecall?lat=" +lat + "&lon=" +lon + "&units=imperial&appid=" +apikey;
    //one call api is an open weather resource that allows us to know the forecast for 7 days
    return fetch(onecall)
      .then(function (response) {
        {
          return response.json();
        }
      })
      .then(function (data) {
        console.log(data);
        //we use our api data to put pull the info of the current day
        currentIcon.append(iconurl);
        currentTemp.textContent = "Temp: " + data.current.temp + "\xB0F";
        currentHum.textContent = "Humidity: " + data.current.humidity + "%";
        currentUvi.textContent = "UV Index: " + data.current.uvi;
        currentWind.textContent = "Wind: " + data.current.wind_speed + "MPH";
        //runs our uvi index through an if statement and gives it a background color depending on the range
        if (data.current.uvi < 3)
          currentInfo.children[3].setAttribute(
            "style",
            "background-color: green"
          );
        else if (3 < data.current.uvi <= 5)
          currentInfo.children[3].setAttribute(
            "style",
            "background-color: yellow"
          );
        else if (5 < data.current.uvi <= 8)
          currentInfo.children[3].setAttribute(
            "style",
            "background-color: orange"
          );
        else if (8 < data.current.uvi <= 11)
          currentInfo.children[3].setAttribute("style", "background-color: red");
        else if (11 < data.current.uvi)
          currentInfo.children[3].setAttribute(
            "style",
            "background-color: purple"
          );

        for (var i = 0; i < forecast.length; i++) {
          //for loop is used for our future forecast days and pull the data
          var icon5 = document.createElement("img");
          icon5.src ="http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png";
          forecast[i].children[4].replaceWith(icon5);
          forecast[i].children[0].textContent = moment()
            .add(i + 1, "days")
            .format("MM/DD/YYYY");
          forecast[i].children[1].textContent =
            "Temp: " + data.daily[i].temp.day + "\xB0F";
          forecast[i].children[2].textContent =
            "Wind: " + data.daily[i].wind_speed + "MPH";
          forecast[i].children[3].textContent =
            "Humidity: " + data.daily[i].humidity + "%";
        }
        display()
      });
      
  });
}

function getApi(event){
    event.preventDefault();
    var city = input.value;
    getweather(city)
}
//saves our input a nd puts it inside our local storage
function saveStorage(){
    if(cityhistory.indexOf(input.value) === -1){
        cityhistory.push(input.value);
        localStorage.setItem('cities',JSON.stringify(cityhistory));
    }
}
btn.addEventListener('submit',function(event){
    event.preventDefault();
    saveStorage();
});
//shows our serach history
function display(){
    for (var i = 0;i <prevsearch.length;i++){
        prevsearch[i].textContent=cityhistory[i];
        prevsearch[i].addEventListener('click',function(event){
            var city = event.target.innerText;
            getweather(city)
        });
    }
}

function init(){
    display();
}

btn.addEventListener('submit',getApi);

init();