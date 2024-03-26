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
        return startHour < endHour || (startHour === endHour && startMinute < endMinute);
    } catch (error) {
        console.error('Error occurred during time comparison:', error);
        return false;
    }
}

export const isDateTimeLessThanCurrent = (givenTime, givenDate) => {
    // Get the current date and time
    const currentDate = new Date();
    
    // Convert the given date and time to a JavaScript Date object
    const givenDateTime = new Date(`${givenDate}T${givenTime}`);
    
    // Compare the given date and time with the current date and time
    return givenDateTime < currentDate;
};

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