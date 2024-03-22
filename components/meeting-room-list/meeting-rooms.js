import { meetingRooms } from '../../services/meeting-rooms-service.js';
import { initializeUserAuth } from '../../utils/common-utils.js';
import { headerComponent } from '../header/header.js';

const initializeMeetingRoomsList = () => {
    console.log('initializemeeting');
    const {isLoggedIn} = initializeUserAuth();
    if(isLoggedIn){
        let header = document.getElementById('header');
        header.appendChild(headerComponent());
        header.style.padding = '10px';
    }
    const meetingList = document.getElementById('meetingRoomsList');

    meetingRooms.forEach(function(room) {
        const li = document.createElement("li");
        const anchorTag = document.createElement("a");
        anchorTag.textContent = room.name;
        anchorTag.href = "../meeting-status/meeting-status" + ".html?param=" + room.name;

        li.appendChild(anchorTag);
        meetingList.appendChild(li);
    });
}
initializeMeetingRoomsList();
