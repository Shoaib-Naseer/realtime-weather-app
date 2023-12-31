/**
 * @license MIT
 * @fileoverview Menage all routes
 * @copyright Shoaib Naseer 2023 All rights reserved
 * @author Shoaib Naseer <shoaibnaseer1111@gmail.com>
 */

'use strict';

import { updateWeather, error404 } from "./app.js";

const defaultLocation = "#/weather?lat=33.6844&lon=73.0479"  //Islamabad

const currentLocation = function () {
    window.navigator.geolocation.getCurrentPosition(res => {
        const { latitude, longitude } = res.coords;
        updateWeather(`lat=${latitude}`, `lon=${longitude}`);
    }, err => {
        window.location.hash = defaultLocation;
    })
}   

/**
 * 
 * @param {string} query Searched Query 
 */
const searchedLocation = query => updateWeather(...query.split("&"));
// updateWeather("lat=33.6844", "lon=73.0479")

const routes = new Map([
    ["/current-location", currentLocation],
    ["/weather", searchedLocation]
])

const checkHash = function () {
    let requestURL = window.location.hash.slice(1);
    console.log(requestURL)
    const [route, query] = requestURL.includes("?") ? requestURL.split("?") : [requestURL];

    routes.get(route) ? routes.get(route)(query) : error404();
}

window.addEventListener("hashchange", checkHash);

window.addEventListener("load", function () {
    if (!window.location.hash) {
        window.location.hash = "#/current-location"
    } else {
        checkHash()
    }
})