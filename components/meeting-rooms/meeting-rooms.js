import { meetingRooms } from '../../services/meeting-rooms-service.js';

const meetingList = document.getElementById('meetingRoomsList');
meetingRooms.forEach(function(room) {
    const li = document.createElement("li");
    const anchorTag = document.createElement("a");
    anchorTag.textContent = room.name;
    anchorTag.href = "../meeting-status/meeting-status" + ".html?param=" + room.name;

    li.appendChild(anchorTag);
    meetingList.appendChild(li);
});