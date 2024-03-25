/**
 * Converts a date and time string into a Date object.
 * @param  date - The date string in the format "YYYY-MM-DD".
 * @param time - The time string in the format "HH:MM".
 * @returns A Date object representing the combined date and time.
 */
export const getTimeObject = (date, time) => {
    try {
        const timeObject = new Date(date);
        // Parse the time string into hours and minutes
        const timeObjectParts = time.split(":");
        const timeObjectHour = parseInt(timeObjectParts[0], 10);
        const timeObjectMinutes = parseInt(timeObjectParts[1], 10);
        // Set the hours and minutes of the time object
        timeObject.setHours(timeObjectHour);
        timeObject.setMinutes(timeObjectMinutes);
        return timeObject;
    } catch (error) {
        console.error('Error occurred during time object creation:', error);
        return null;
    }
}


/**
 * Checks if the start time is less than the end time.
 * @param startTime - The start time string in the format "HH:MM".
 * @param endTime - The end time string in the format "HH:MM".
 * @returns True if the start time is less than the end time, otherwise false.
 */
export const isFromTimeLessThanToTime = (startTime, endTime) => {
    try {
        // Split the start time and end time strings into hours and minutes
        const [startHour, startMinute] = startTime.split(":").map(Number);
        const [endHour, endMinute] = endTime.split(":").map(Number);
        
        return startHour > endHour || (startHour === endHour && startMinute > endMinute);
    } catch (error) {
        console.error('Error occurred during time comparison:', error);
        return false;
    }
}

/**
 * Checks if the specified time is greater than the current time and Date is equal to the current date
 * @param time - The time string in the format "HH:MM".
 * @param date - The date string or Date object representing the date.
 * @returns True if the specified time is greater than the current time, otherwise false.
 */
export const isTimeGreaterThanCurrentTime = (time, date) => {
    try {
        // Convert the time string and date string to a Date object
        let timeObject = getTimeObject(date, time);
        let convertedDateObject = getCurrentDateAndTime();
        
        // Check if the specified date is the current date and if the specified time is greater than the current time
        let isTimeGreaterThanCurrentTime = date === new Date() && timeObject.time > convertedDateObject.time ? true : false;
        return isTimeGreaterThanCurrentTime;
    } catch (error) {
        console.error('Error occurred during time comparison:', error);
        return false;
    }
}
/**
 * Get current date and time
 * @param {*} date 
 * @returns date and time as an object
 */
export const getCurrentDateAndTime = (date) => {
    const convertedDateObject = {};
    let dateObject = date ? new Date(date) : new Date();
    convertedDateObject.time = dateObject.getHours() * 100 + dateObject.getMinutes(); 
    convertedDateObject.date = dateObject;
    return convertedDateObject;
}

/**
 * Concat time and convert into integer
 * @param {*} time 
 * @returns 
 */
export const splitTimeConversion = (time) => {
    return parseInt(time.replace(":", ""), 10)
}