import { getItemFromLocalStorage } from "./local-storage-utils.js"
import { getTimeObject } from "./time-utils.js";

/**
 * Retrieves meeting details from local storage based on the specified room name.
 * @param roomName - Optional room name to filter the meeting details.
 * @returns  An array containing meeting details filtered by the specified room name,
 *                  or all meeting details if no room name is provided, or an empty array if there are no meetings.
 */
export const getMeetingDetails = (roomName) => {
    try {
        const meetings = JSON.parse(getItemFromLocalStorage('meetings'));
        if (meetings) {
            return roomName ? meetings.filter(meeting => meeting.room === roomName) : meetings;
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error occurred during meeting details retrieval:', error);
        return [];
    }
}

/**
 * Checks the availability of a room for a requested meeting time.
 * @param roomName - The name of the room to check availability for.
 * @param requestMeetingInfo - Information about the requested meeting.
 * @returns A boolean value indicating whether the room is booked or available
 */
export const checkAvailabilityOfRoom = (roomName, requestMeetingInfo) => {
    try {
        const meetingDetails = getMeetingDetails(roomName);
        // Get the time object for the requested meeting
        let requestedTimeObject = requestMeetingInfo ? getTimeObject(requestMeetingInfo.date, requestMeetingInfo.from) : new Date();
        let isRoomBooked = false;
        // Iterate through each meeting detail to check for overlap
        meetingDetails?.forEach(meeting => {
            // Get time objects for start and end times of the current meeting
            const endTimeObject = getTimeObject(meeting.date, meeting.to);
            const startTimeObject = getTimeObject(meeting.date, meeting.from);
            // Check if the requested meeting time overlaps with any existing meeting
            if (requestedTimeObject < endTimeObject && requestedTimeObject > startTimeObject) {
                // Set the room as booked and exit the loop
                isRoomBooked = true;
                return;
            }
        });
        return isRoomBooked;
    } catch (error) {
        console.error('Error occurred during room availability check:', error);
        return false;
    }
}
