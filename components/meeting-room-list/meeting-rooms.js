import { ROUTES } from '../../constants/routes-constants.js';
import { meetingRooms } from '../../services/meeting-rooms-service.js';
import { createElement, getElementById, setHeaderSection } from '../../utils/common-utils.js';

const initializeMeetingRoomsList = () => {
    let header = getElementById('header');
    header = setHeaderSection(header);

    const meetingList = getElementById('meetingRoomsList');

    meetingRooms.forEach(room => {
        const meetingListItem = createElement("li");
        const meetingRoomLink = createElement("a");
        meetingRoomLink.textContent = room.name;
        meetingRoomLink.href = `${ROUTES.meetingStatus}?param=${room.name}`;

        meetingListItem.appendChild(meetingRoomLink);
        meetingList.appendChild(meetingListItem);
    });
}
initializeMeetingRoomsList();