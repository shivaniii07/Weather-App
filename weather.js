const  userTab =document.querySelector("[your-data]");
const searchTab =document.querySelector("[search-data]");
const userContainer=document.querySelector(".weather-container");
const grantAccessContainer=document.querySelector(".location-container");
const searchForm= document.querySelector("[data-searchFom]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".your-weather");

//initial variable need--
let currentTab= userTab;
const API_KEY =  "d1845658f92b31c64bd94f06f7188c9c";

currentTab.classList.add("current-tab");
getFromSessionStorage();

function switchTab(clickedTab)
{
    if(clickedTab!=currentTab)
    {
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

    if(!searchForm.classList.contains("active"))
    {  
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchForm.classList.add("active");
    }
    else{
        //mai phale search vala tab pa thaa abb yours weather vala tab visible karna hai
    searchForm.classList.remove("active");
    userInfoContainer.classList.remove("active");
    //yaha pa hmme lat lon ko le ka yours weather details batana hai isiliye phale hmme 
    //userinfocontainer hide karna hoga phaele
    //abb mai your wether vala tab mai aa gaya hu,so weather bhi display karna hoga ,so lets 
    //check local storage first for coordinates,if we have saved them there
    getFromSessionStorage();
   
    }
    }
}

userTab.addEventListener("click" , () =>{
    //pass clicked tab as input prameter
  switchTab(userTab);
});

searchTab.addEventListener("click" , () =>{
    //pass clicked tab as input prameter
  switchTab(searchTab);
});
//check if coordintes are present in session storage
function getFromSessionStorage()
{ const localCoordinates= sessionStorage.getItem("user-coordinates");
  if(!localCoordinates)
  { //agar local coordinates nhi mile
    grantAccessContainer.classList.add("active");

  }
else{
    const coordinates =JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
}
}
 async function fetchUserWeatherInfo(coordinates){
const {lat, lon} = coordinates;
//make grant access invisible
grantAccessContainer.classList.remove("active");
//make loader visible
loadingScreen.classList.add("active");

//API CALL
try{
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      loadingScreen.classList.remove("active");
      //abb hmme lat lon ki value mil gayi hai soo abb user info container ko visible karva denge
      userInfoContainer.classList.add("active");
      //abb hmna joh user info container ko visible karvaya hai abb usmai value dalengae
      //joh ki hai render karvana ui pa
      renderWeatherInfo(data);
}
catch(err)
{
   loadingScreen.classList.remove("active");
}
 }

 function renderWeatherInfo(weatherInfo)
 {
    //phale data fetch karka laoo frr response mai sa nikalka ussa dal doo or render karva doo
    const cityName= document.querySelector("[city-name]");
    const countryIcon=document.querySelector("[ cityIcon]");
    const desc = document.querySelector("[city-desc]");
    const weatherIcon = document.querySelector("[weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-clouds]");
    
    console.log(weatherInfo);

    //fetch vlues from weather info object and put it ui element
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.inneText= weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} Â°C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
 }
//  grant acess button pa click karenge toh hmara location ask karega
 function getLocation()
 {
    if(navigator.geolocation)
    {
       navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
      //hw altert show if location not given
    }
 }
 function showPosition(position)
 {
  const userCoordinates={
    lat: position.coords.latitude,
    lon: position.coords.longitude,

  }
  sessionStorage.setItem["user-coordinates" ,JSON.stringify[userCoordinates]];
   fetchUserWeatherInfo(userCoordinates);
 }

 const grantAccessButton = document.querySelector("[data-grantAccess]");
 grantAccessButton.addEventListener("click", getLocation);

 //search weather
const searchInput=document.querySelector("[data-seachInput]");
 searchForm.addEventListener("submit",(e)=>{
  e.preventDefault();
  let cityName= searchInput.value;
  if ( cityName === "")
     return;
  else
    fetchSearchWeatherInfo(cityName);
 })
 
   async function fetchSearchWeatherInfo(city)
  {  loadingScreen.classList.add("active");
     userInfoContainer.classList.remove("active");
     grantAccessContainer.classList.remove("active");

     //API CALL
     try{
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
    
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);

      }
    catch(err){
      //hw
    }
  }

