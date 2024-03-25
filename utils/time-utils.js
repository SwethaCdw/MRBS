export const getTimeObject = (date, time) => {
    const timeObject = new Date(date);
    const timeObjectParts = time.split(":");
    const timeObjectHour = parseInt(timeObjectParts[0], 10);
    const timeObjectMinutes = parseInt(timeObjectParts[1], 10);
    timeObject.setHours(timeObjectHour);
    timeObject.setMinutes(timeObjectMinutes);

    console.log('Passed Date and Time : ' + date + " " + time + "Converted time : " + timeObject);

    return timeObject;
}

export const isFromTimeLessThanToTime = (startTime, endTime) => {
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    
    return startHour > endHour || (startHour === endHour && startMinute > endMinute);
}

export const getCurrentDateAndTime = (date) => {
    const convertedDateObject = {};
    let dateObject = date ? new Date(date) : new Date();
    convertedDateObject.time = dateObject.getHours() * 100 + dateObject.getMinutes(); 
    convertedDateObject.date = dateObject;
    return convertedDateObject;
}

export const splitTimeConversion = (time) => {
    return parseInt(time.replace(":", ""), 10)
}