/**
 * @license MIT
 * @fileoverview All module functions
 * @copyright Shoaib Naseer 2023 All rights reserved
 * @author Shoaib Naseer <shoaibnaseer1111@gmail.com>
 */

"use Strict";

export const weekDayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
]

export const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
]

/**
 * Get the Day, Date and Month in a given timezone.
 * @param {number} dateUnix Unix Date in seconds 
 * @param {number} timezone Timezone Shift from UTC in seconds
 * @returns {string} Date String. Format "Sunday 10, Jan"
 */
export const getDate = function (dateUnix, timezone) {
    const date = new Date((dateUnix + timezone) * 1000);
    const weekDayName = weekDayNames[date.getUTCDay()];
    const monthName = monthNames[date.getUTCMonth()];
    
    return `${weekDayName} ${date.getUTCDate()}, ${monthName} `
}

/**
 * Get the time with AM and PM in a given timezone.
 * @param {number} dateUnix - The date in Unix timestamp format.
 * @param {number} timezone - The time zone shift in seconds.
 * @returns {string} The formatted time with AM or PM. e.g. "HH:MM AM/PM "
 */
export const getTime = function (dateUnix, timezone) {
    const date = new Date((dateUnix + timezone) * 1000);
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';

    const timeString = `${hours % 12 || 12}:${minutes} ${period}`;
    return timeString;
};

/**
 * Get the time with AM and PM in a given timezone.
 * @param {number} dateUnix - The date in Unix timestamp format.
 * @param {number} timezone - The time zone shift in seconds.
 * @returns {string} The formatted time with AM or PM. e.g. "HH AM/PM "
 */
export const getHours = function (dateUnix, timezone) {
    const date = new Date((dateUnix + timezone) * 1000);
    let hours = date.getUTCHours();
    const period = hours >= 12 ? 'PM' : 'AM';

    const timeString = `${hours % 12 || 12} ${period}`;
    return timeString;
};

/**
 * 
 * @param {number} mps Meter per seconds 
 * @returns {number} Kilometer per hours
 */
export const mps_to_kmh = mps => {
    const mph = mps * 3600;
    return mph / 1000;
}

export const aqiText = {
    1: {
        level: "Good",
        message: "Air quality is considered satisfactory, and air pollution poses little or no risk."
    },
    2: {
        level: "Fair",
        message: "Air quality is acceptable; however, there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution."
    },
    3: {
        level: "Moderate",
        message: "Members of sensitive groups, such as children, the elderly, and individuals with respiratory or heart conditions, may experience health effects. The general public is not likely to be affected."
    },
    4: {
        level: "Poor",
        message: "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects."
    },
    5: {
        level: "Very Unhealthy",
        message: "Health alert: everyone may experience more serious health effects."
    },
    6: {
        level: "Hazardous",
        message: "Health warnings of emergency conditions. The entire population is more likely to be affected."
    }
};
