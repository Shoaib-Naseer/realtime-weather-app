/**
 * @license MIT
 * @fileoverview All api related stuff like api_key, api request etc.
 * @copyright Shoaib Naseer 2023 All rights reserved
 * @author Shoaib Naseer <shoaibnaseer1111@gmail.com>
 */

'use strict'

const api_key = "69259004c2ebac362b71a19cefe024b6";

/**
 * 
 * @param {string} URL API URL 
 * @param {Function} callback callback 
 */

export const fetchData = function (URL, callback) {
    fetch(`${URL}&appid=${api_key}`).then(res => res.json()).then(data => callback(data));
}

export const url = {
    currentWeather(lat,long){
        return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric`
    },
    forecast(lat,long){
        return `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&units=metric`
    },
    airPollution(lat,long){
        return `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${long}&units=metric`
    },
    reverseGeo(lat,long){
        return `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${long}&units=metric`
    },
    /**
     * 
     * @param {string} query Search Query e.g. : "Islamabad" 
     * @returns 
     */
    geoCoding(query){
        return `http://api.openweathermap.org/geo/1.0/direct?${query}&limit=5`
    }
}