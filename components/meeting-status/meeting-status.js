import { meetingRooms } from '../../services/meeting-rooms-service.js';
import {getParameterByName, initializeUserAuth} from '../../utils/common-utils.js';
import { ICON_MAP } from '../../constants/common-constants.js';
import { headerComponent } from '../header/header.js';

const getRoomAmenities = (meetingRooms, roomName) => meetingRooms.find(room => room.name === roomName);

const initializeMeetingStatus = () => {
    const {isLoggedIn} = initializeUserAuth();
    if(isLoggedIn){
        let header = document.getElementById('header');
        header.appendChild(headerComponent());
        header.style.padding = '10px';
    }

    const meetings = JSON.parse(localStorage.getItem('meetings'));

    //Room name
    var roomName = getParameterByName('param');
    const meetingRoomName = document.getElementById('room-name');
    meetingRoomName.textContent = roomName;

    //Filter meetings based on room name
    const filteredMeetings = meetings.filter(meeting => meeting.room === roomName);

    const upcomingMeetingsList = document.getElementById('upcoming-meetings');
    const currentMeeting = document.getElementById('current-meeting');

    //
    const currentDate = new Date();
    const currentTime = currentDate.getHours() * 100 + currentDate.getMinutes(); 

    if(filteredMeetings.length != 0){
        filteredMeetings.forEach(function(meeting) {
            const meetingDate = new Date(meeting.date);
            const meetingFrom = parseInt(meeting.from.replace(":", ""), 10); 
            const meetingTo = parseInt(meeting.to.replace(":", ""), 10); 
            
            if (currentDate.toDateString() === meetingDate.toDateString() && currentTime >= meetingFrom && currentTime <= meetingTo) {
            currentMeeting.style.backgroundColor = "#8d0000";
            console.log(`Meeting "${meeting.name}" in ${meeting.room} is currently in progress.`, currentMeeting);
            let currentMeetingName = document.createElement('p');
            currentMeetingName.textContent = meeting.name;
            currentMeeting.appendChild(currentMeetingName);
            } else {
            currentMeeting.style.backgroundColor = "#008d00";
            currentMeeting.textContent = 'Room is Available';
            const div = document.createElement("div");
            const ul = document.createElement('ul');
            const li = document.createElement('li');
            li.textContent = meeting.name;
            ul.appendChild(li);
            div.appendChild(ul);
            upcomingMeetingsList.appendChild(div);
            }
        });
    } else {
            currentMeeting.style.backgroundColor = "#008d00";
            let currentMeetingName = document.createElement('p');
            currentMeetingName.textContent = 'Room is Available';
            currentMeeting.appendChild(currentMeetingName);
    }


    //Room amenities
    const roomAmenities = getRoomAmenities(meetingRooms, roomName);
    createAmenities(roomAmenities);

    //Book a room button
    let bookingRoomButton = document.createElement('button');
    bookingRoomButton.textContent = 'Book a Room';
    bookingRoomButton.id = 'book-button';
    upcomingMeetingsList.appendChild(bookingRoomButton);

    bookingRoomButton.addEventListener('click', function() {
        window.location.href = '../schedule-meeting/schedule-meeting.html';
    });

}

const createAmenities = (amenities) => {
    const roomAmenities = document.getElementById('room-amenities');
    console.log(roomAmenities, amenities);
    roomAmenities.innerHTML = '';


    const div = document.createElement('div');
    roomAmenities.innerHTML = `
        <div>
            <i class="fa-solid fa-chair"></i>
            <p>${amenities.occupancy || ''}</p>
        </div>
        ${amenities.utilities.map(utility => `<div><i class="fa-solid ${ICON_MAP[utility]}"></i></div>`).join('')}
    `;
    // roomAmenities.appendChild(div);

}

initializeMeetingStatus();

