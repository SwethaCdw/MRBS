import { setItemInLocalStorage } from "../../utils/local-storage-utils.js";
import { getMeetingDetails } from "../../utils/meeting-utils.js";
import { getTimeObject } from "../../utils/time-utils.js";

/**
 * Checks if the current time is greater than the end time of a meeting.
 * @param meeting - The meeting object containing date and end time.
 * @returns True if the current time is greater than the end time of the meeting, otherwise false.
 */
const checkIsValidRoomTime = (meeting) => {
    try {
        const currentTime = new Date();

        // Get the end time of the meeting
        const timeObject = getTimeObject(meeting.date, meeting.to);

        // Compare current time with meeting end time
        return currentTime > timeObject;
    } catch (error) {
        console.error('Error occurred while checking room time validity:', error);
        return false; 
    }
};

/**
 * Removes completed meetings from the list based on current time.
 */
export const removeCompletedMeeting = () => {
    try {
        const meetingDetails = getMeetingDetails();

        if (meetingDetails) {
            meetingDetails.forEach(meeting => {
                meeting.isMeetingCompleted = checkIsValidRoomTime(meeting);
            });

            // Store updated meeting details back in local storage
            setItemInLocalStorage('meetings', JSON.stringify(meetingDetails));
        }
    } catch (error) {
        console.error('Error occurred while removing completed meetings:', error);
    }
};
