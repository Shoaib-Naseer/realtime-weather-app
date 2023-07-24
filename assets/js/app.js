/**
 * @license MIT
 * @copyright Shoaib Naseer 2023 All rights reserved
 * @author Shoaib Naseer <shoaibnaseer1111@gmail.com>
 */

'use strict';

import { fetchData, url } from "./api.js";
import * as module from "./module.js";

/**
 * 
 * @param {NodeLists} elements Element Nodes array
 * @param {string} eventType Event type e.g. "click", "mouseover"
 * @param {Function} callback Callback Functions
 */
const addEventOnElements = function (elements, eventType, callback) {
    for (const element of elements) {
        element.addEventListener(eventType, callback);
    }
};


/**
 * Toggle Search in Mobile devices
 */
const searchView = document.querySelector("[data-search-view]");
const searchToggler = document.querySelectorAll("[data-search-toggler]")

const toggleSearch = () => {
    searchView.classList.toggle("active")
}
addEventOnElements(searchToggler, 'click', toggleSearch)

/**
 * Search Api Integration
 */

const searchField = document.querySelector("[data-search-field]")
const searchResult = document.querySelector("[data-search-result]")

let searchTimeout = null;
const searchTimeoutDuration = 500;


searchField.addEventListener("input", function () {
    clearTimeout(searchTimeout);
    if (!searchField.value) {
        searchResult.classList.remove("active");
        searchResult.innerHTML = "";
        searchField.classList.remove("searching")
    } else {
        searchField.classList.add("searching");
    }

    if (searchField.value) {
        searchTimeout = setTimeout(() => {
            fetchData(url.geo(searchField.value), function (Locations) {
                searchField.classList.remove("searching");
                searchResult.classList.add("active");
                searchResult.innerHTML = `
            <ul class="view-list" data-search-list>
            </ul>
            `
                const /** {Nodelist} | [] */ items = [];

                for (const { name, lat, lon, country, state } of Locations) {
                    const searchItem = document.createElement("li");
                    searchItem.classList.add("view-item");
                    searchItem.innerHTML = `
                <span class="m-icon">
                            location_on
                        </span>
                        <div>
                            <p class="item-title">${name}</p>
                            <p class="label-2 item-subtitle">${state || ""}, ${country}</p>
                        </div>
                        <a href="#/weather?lat=${lat}&lon=${lon}" class="item-link has-state" data-search-toggler>
                        </a>
                `
                    searchResult.querySelector("[data-search-list]").appendChild(searchItem);
                    items.push(searchItem.querySelector("[data-search-toggler]"))
                    addEventOnElements(items, 'click', toggleSearch)
                    // searchResult.classList.remove("active")
                }
            })
        }, searchTimeoutDuration)
    }
});

const container = document.querySelector("[data-container]");
const loading = document.querySelector("[data-loading]");
const currentLocationBtn = document.querySelector("[data-current-location-btn]");
const errorContent = document.querySelector("[data-error-content]")
/**
 * Render all Weather Data into HTML
 * @param {number} lat 
 * @param {number} lon 
 */
export const updateWeather = function (lat, lon) {
    loading.style.display = "grid";
    container.style.overlay = "hidden";
    container.classList.contains("fade-in") ?? container.classList.remove("fade-in");
    errorContent.style.display = "none";

    const currentWeatherSection = document.querySelector("[data-current-weather]");
    const highlightSection = document.querySelector("[data-highlights]");
    const hourlySection = document.querySelector("[data-hourly-forecast]");
    const forecastSection = document.querySelector("[data-5-days-forecast");

    currentWeatherSection.innerHTML = "";
    highlightSection.innerHTML = "";
    hourlySection.innerHTML = "";
    forecastSection.innerHTML = "";

    if (window.location.hash === "#/current-location") {
        currentLocationBtn.setAttribute("disabled", "")
    } else {
        currentLocationBtn.removeAttribute("disabled")
    }

    /**
     * Current Weather Section
     */
    lat = lat.split("=")[1];
    lon = lon.split("=")[1]

    fetchData(url.currentWeather(lat, lon), function (currentWeather) {
        const {
            weather,
            dt: dateUnix,
            sys: { sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC },
            main: { temp, feels_like, pressure, humidity },
            visibility,
            timezone
        } = currentWeather;
        const [{ description, icon }] = weather;
        const card = document.createElement("div");
        card.classList.add("card", "card-lg", "current-weather-card");
        card.innerHTML = `
        <h2 class="title-2 card-title">Now</h2>
        <div class="weapper">
            <p class="heading">${parseInt(temp)} &deg;<sup class="heading">c</sup></p>
            <img src="./assets/images/weather_icons/${icon}.png" alt="${description}" width="64" height="64" class="weather-icon">
        </div>
        <p class="body-3">${description}</p>
        <ul class="meta-list">
            <li class="meta-item">
                <span class="m-icon">
                    calendar_month
                </span>
                <p class="title-3 meta-text">${module.getDate(dateUnix, timezone)}</p>
            </li>

            <li class="meta-item">
                <span class="m-icon">
                    location_on
                </span>
                <p class="title-3 meta-text" data-location></p>
            </li>
        </ul>
        `;

        fetchData(url.reverseGeo(lat, lon), function ([{ name, country }]) {
            card.querySelector("[data-location]").innerHTML = `${name} ,${country}`
        });
        currentWeatherSection.appendChild(card);

        /**
         * Today's Highlight
         */

        fetchData(url.airPollution(lat, lon), function (data) {
            const [{ main: { aqi }, components: { so2, no2, o3, pm2_5 } }] = data.list;
            const card = document.createElement("div");
            card.classList.add("card", "card-lg")
            card.innerHTML = `
            <h2 class="title-2" id="highlights-label">
            Today's Highlights
        </h2>
    
        <div class="highlight-list">
            <div class="card card-sm highlight-card one">
                <h3 class="title-3">Air Quality Index</h3>
                <div class="wrapper">
                    <span class="m-icon">air</span>
                    <ul class="card-list">
                        <li class="card-item">
                            <p class="title-1">${(pm2_5).toFixed(2)}</p>
                            <p class="label-1">PM<sub>2.5</sub></p>
                        </li>
                        <li class="card-item">
                            <p class="title-1">${(so2).toFixed(2)}</p>
                            <p class="label-1">SO<sub>2</sub></p>
                        </li>
                        <li class="card-item">
                            <p class="title-1">${(no2).toFixed(2)}</p>
                            <p class="label-1">NO<sub>2</sub></p>
                        </li>
                        <li class="card-item">
                            <p class="title-1">${(o3).toFixed(2)}</p>
                            <p class="label-1">0<sub>3</sub></p>
                        </li>
                    </ul>
                </div>
    
                <span class="badge aqi-1 label-1" title="aqi message">
                    ${module.aqiText[aqi].level}
                </span>
            </div>

            <div class="card card-sm highlight-card two">
            <h3 class="title-3">
                Sunrise & Sunset
            </h3>

            <div class="card-list">
                <div class="card-item">
                    <span class="m-icon">clear_day</span>
                    <div>
                        <p class="label-1">Sunrise</p>
                        <p class="title-1">${module.getTime(sunriseUnixUTC, timezone)}</p>
                    </div>
                </div>
                <div class="card-item">
                    <span class="m-icon">clear_night</span>
                    <div>
                        <p class="label-1">Sunset</p>
                        <p class="title-1">${module.getTime(sunsetUnixUTC, timezone)}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="card card-sm highlight-card ">
            <h3 class="title-3">
                Humidity
            </h3>
            <div class="wrapper">
                <span class="m-icon">Humidity_percentage</span>
                <p class="title-1">${humidity} % </p>
            </div>
        </div>

        <div class="card card-sm highlight-card ">
            <h3 class="title-3">
                Pressure
            </h3>
            <div class="wrapper">
                <span class="m-icon">airwave</span>
                <p class="title-1">${pressure}hPa   </p>
            </div>
        </div>

        <div class="card card-sm highlight-card ">
            <h3 class="title-3">
                Visibility
            </h3>
            <div class="wrapper">
                <span class="m-icon">Visibility</span>
                <p class="title-1">${parseInt(visibility/1000)}km</p>
            </div>
        </div>
                        
        <div class="card card-sm highlight-card ">
            <h3 class="title-3">
                Feels Like
            </h3>
            <div class="wrapper">
                <span class="m-icon">thermostat</span>
                <p class="title-1">${feels_like} &deg; c </p>
            </div>
        </div>
            
    </div>    
            `
    highlightSection.appendChild(card);
        })
    })

    fetchData(url.forecast(lat,lon), function (forecast){
        const {
            list: forecastList,
            city: {timezone}
        } = forecast;

        hourlySection.innerHTML = `
        <h2 class="title-2">Today at</h2>
        <div class="slider-container">
            <ul class="slider-list" data-temp>
            </ul>
        </div>
        <div class="slider-container">
            <ul class="slider-list" data-wind>     
            </ul>
        </div>
        `;
        for(const [index,data] of forecastList.entries()){
            if(index > 7) break
            const {dt:dateTimeUnix,main:{temp},weather,wind:{deg: windDirection,speed:windSpeed}} = data;
            const [{icon, description}] = weather;
            const tempLi = document.createElement("li");
            tempLi.classList.add("slider-item");
            tempLi.innerHTML = `
            <div class="card card-sm slider-card">
                <p class="body-3">${module.getHours(dateTimeUnix,timezone)}</p>
                <img src="./assets/images/weather_icons/${icon}.png" loading="lazy" width="48" height="48" alt="" class="weather-icon" title=${description}>
                <p class="body-3">${parseInt(temp)}&deg;</p>
            </div>
            `;
            hourlySection.querySelector("[data-temp]").appendChild(tempLi)

            const windLi = document.createElement("li");
            windLi.classList.add("slider-item");
            windLi.innerHTML = `
            <div class="card card-sm slider-card">
                <p class="body-3">${module.getHours(dateTimeUnix,timezone)}</p>
                <img src="./assets/images/weather_icons/direction.png" loading="lazy" width="48" height="48" alt="" class="weather-icon" style="transform: rotate(${windDirection - 180}deg);">

                <p class="body-3">${parseInt(module.mps_to_kmh(windSpeed))}&deg;</p>
            </div>
            `;
            
            hourlySection.querySelector("[data-wind]").appendChild(windLi)
        }  
        /*
        *   5 days forecast section
         */ 
        forecastSection.innerHTML = `
        <h2 class="title-2" id="forecast-label">5 Days Forecast</h2>
        <div class="card card-lg forecast-card">
            <ul data-forecast-list>   
                </li>
            </ul>
        </div>
        `;
        for (let i = 7; i < forecastList.length; i += 8){
            const {
                main:{ temp_max},
                weather,
                dt_txt
            } = forecastList[i];
            const [{icon, description}] = weather;
            const daysLi = document.createElement("li");
            const date = new Date(dt_txt)
        daysLi.classList.add("card-item");
        daysLi.innerHTML = `
        <div class="icon-wrapper">
        <img src="./assets/images/weather_icons/${icon}.png" width="36" height="36" alt="Overcast Clouds" class="weather-icon" alt="${description}">

        <span class="span"><p class="title-2">${parseInt(temp_max)}</p></span>
     </div>
     <p class="label-1">${date.getDate()} ${module.monthNames[date.getMonth()]}</p>
     <p class="label-1">${module.weekDayNames[date.getUTCDay()]}</p>
        `;

        forecastSection.querySelector("[data-forecast-list]").appendChild(daysLi)
        }
    })
    
    loading.style.display = "none";
    container.style.overflowY = "overlay";
    container.classList.add("fade-in")
}

export const error404 = function () {
        const errorContent = document.querySelector("[data-error-content]")
        errorContent.style.display = "flex";
}   