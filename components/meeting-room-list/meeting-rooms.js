import { ROUTES } from '../../constants/routes-constants.js';
import { meetingRooms } from '../../services/meeting-rooms-service.js';
import { createElement, getElementById, initializeUserAuth, routeTo, setHeaderSection } from '../../utils/common-utils.js';

const initializeMeetingRoomsList = () => {
    try {
        // Get the header element and set the header section
        let header = getElementById('header');
        header = setHeaderSection(header);

        // Get the meeting rooms list element
        const meetingList = getElementById('meetingRoomsList');

        // Iterate over each meeting room and create a list item with a link for each room
        meetingRooms?.forEach(room => {
            const meetingListItem = createElement("li");
            const meetingRoomLink = createElement("a");
            meetingRoomLink.textContent = room.name;
            meetingRoomLink.href = `${ROUTES.outerFolderPath}${ROUTES.meetingStatus}?room=${room.name}`;
            meetingListItem.appendChild(meetingRoomLink);
            meetingList.appendChild(meetingListItem);
        });
    } catch (error) {
        console.error('Error occurred in initializeMeetingRoomsList:', error);
    }
};

initializeMeetingRoomsList()

