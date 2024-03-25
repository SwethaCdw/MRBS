import { getItemFromLocalStorage } from "./local-storage-utils.js"
import { getTimeObject } from "./time-utils.js";

export const getMeetingDetails = (roomName) => {
    const meetings = JSON.parse(getItemFromLocalStorage('meetings'));
    if(meetings){
        return roomName ? meetings.filter(meeting => meeting.room === roomName) : meetings;
    } else {
        return [];
    }
    
}

export const checkAvailabilityOfRoom = (roomName, requestMeetingInfo) => {
    const meetingDetails = getMeetingDetails(roomName);
    const requestedTimeObject = getTimeObject(requestMeetingInfo.date, requestMeetingInfo.from);
    let isRoomBooked = false;
    meetingDetails?.forEach(meeting => {
        console.log('swe',meeting);
        const meetingTimeObject = getTimeObject(meeting.date, meeting.to);
        if(requestedTimeObject < meetingTimeObject){
            isRoomBooked = true;
            return;
        }
    });
    return isRoomBooked;
}

export const checkRoomStatus = (roomName, currentTime) => {
    const meetingDetails = getMeetingDetails(roomName);
    let isRoomBooked = false;
    meetingDetails?.forEach(meeting => {
        const meetingTimeObject = getTimeObject(meeting.date, meeting.to);
        if(currentTime < meetingTimeObject){
            isRoomBooked = true;
            return;
        }
    });
    return isRoomBooked ? 'Busy' : 'Available';
}