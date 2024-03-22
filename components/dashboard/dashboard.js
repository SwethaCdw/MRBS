import { MEETING_INFO_ICON } from "../../constants/common-constants.js";
import { initializeUserAuth } from "../../utils/common-utils.js";
import { meetingRooms } from "../../services/meeting-rooms-service.js";
import { createElement } from "../../utils/common-utils.js";
import { headerComponent } from "../header/header.js";

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content has been loaded');
});


const initializeDashboard = () => {
    const meetings = JSON.parse(localStorage.getItem('meetings'));

    const {isLoggedIn, username} = initializeUserAuth();
    if(isLoggedIn){
        let header = document.getElementById('header');
        header.appendChild(headerComponent());
        header.style.padding = '10px';
    }
    const filteredMeetings = filterMeetingsByName(meetings, username);
    initializeMeetingCards(filteredMeetings);
    

}

const createMeetingCard = (meeting) => {
    const card = document.createElement('card-component');
    let meetingInfoElement = `<h3>${meeting.name}</h3>`;
    Object.keys(MEETING_INFO_ICON).forEach(icon => {
        meetingInfoElement+= icon === 'time' ?  
            `${createMeetingInfoElement(icon, meeting.from + " - " + meeting.to)}` : 
            `${createMeetingInfoElement(icon, meeting[icon])}`;
    });
    card.innerHTML = meetingInfoElement;
    card.classList.add('meeting-card');
    return card;
}

const createMeetingInfoElement = (icon, data) => {
    const meetingInfoElement = `<p> <i class="fa-solid ${MEETING_INFO_ICON[icon]}"></i> ${data} </p>`;
    return meetingInfoElement;
}

// Function to initialize meeting cards
const initializeMeetingCards = (meetings) => {
    console.log(meetings);
    let myUpcomingMeetings = document.getElementById('my-meetings');
    if(meetings && meetings?.length != 0){
        console.log(meetings);
        const fragment = document.createDocumentFragment();
        meetings?.forEach(meeting => {
            const card = createMeetingCard(meeting);
            fragment.appendChild(card);
        });
        myUpcomingMeetings.appendChild(fragment);
    } else {
        let noMeetings = createElement('p');
        noMeetings.textContent = 'No upcoming meetings.'
        myUpcomingMeetings.appendChild(noMeetings);
    }
    
}

// Initialize meeting cards
const filterMeetingsByName = (meetings, name) => meetings?.filter(meeting => meeting.organizer === name);

initializeDashboard();


const createMeetingRoomCard = (room) => {
    let meetingRoomCard = createElement('div', 'meeting-room-card');
    let cardImage = createElement('img', 'card-image');
    cardImage.src = room.image;
    let cardDetailElement = createElement('div', null, 'meeting-rooms-detail');
    let meetingRoomName = createElement('p', 'room-name');
    meetingRoomName.innerText = room.name;
    cardDetailElement.appendChild(meetingRoomName);
    meetingRoomCard.appendChild(cardImage);
    meetingRoomCard.appendChild(cardDetailElement);
    return meetingRoomCard;
}



const createMeetingRoomContainer = () => {
    let meetingRoomDF = document.createDocumentFragment();
    meetingRooms.forEach(room => {
        let roomCard = createMeetingRoomCard(room);
        meetingRoomDF.appendChild(roomCard);
    });

    let meetingRoomContainer = document.getElementById('meeting-rooms');
    meetingRoomContainer.appendChild(meetingRoomDF);
}

createMeetingRoomContainer();

const floatingIconElement = document.getElementById('floating-icon');
floatingIconElement.addEventListener('click', function() {
    window.location.href = '../schedule-meeting/schedule-meeting.html';
  });