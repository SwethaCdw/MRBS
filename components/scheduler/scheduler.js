import { setItemInLocalStorage } from "../../utils/local-storage-utils.js";
import { getMeetingDetails } from "../../utils/meeting-utils.js";
import { getTimeObject } from "../../utils/time-utils.js";

const checkIsValidRoomTime = (meeting) => {
    const currentTime = new Date();
    const timeObject = getTimeObject(meeting.date, meeting.to);
    return currentTime > timeObject;
}

export const removeCompletedMeeting = () => {
    const meetingDetails = getMeetingDetails();
    meetingDetails?.forEach(meeting => {
        meeting.isMeetingCompleted = checkIsValidRoomTime(meeting);
    });
    setItemInLocalStorage('meetings', JSON.stringify(meetingDetails));
}

