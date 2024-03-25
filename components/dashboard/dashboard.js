import { EVENT_LISTENERS, MEETING_INFO_ICON, NO_UPCOMING_MEETINGS } from "../../constants/common-constants.js";
import { getElementById, initializeUserAuth, createElement } from "../../utils/common-utils.js";
import { meetingRooms } from "../../services/meeting-rooms-service.js";
import { headerComponent } from "../header/header.js";
import { checkRoomStatus } from "../../utils/meeting-utils.js";
import { ROUTES } from "../../constants/routes-constants.js";
import { getItemFromLocalStorage } from "../../utils/local-storage-utils.js";
import { removeCompletedMeeting } from "../scheduler/scheduler.js";

const initializeDashboard = () => {
    setInterval(removeCompletedMeeting, 10000);

    const { username } = initializeUserAuth();
    const meetings = JSON.parse(getItemFromLocalStorage('meetings'));

    //Get header component
    let header = getElementById('header');
    header.appendChild(headerComponent());
    header.style.padding = '10px';

    //Filter meetings based on username
    const filteredMeetings = filterMeetingsByName(meetings, username)?.filter(meeting => !meeting.isMeetingCompleted);

    //Initialize Upcoming meeting cards
    initializeMeetingCards(filteredMeetings);

    //Initialize Meeting room cards
    createMeetingRoomContainer();

    //Icon for moving to schedule form
    const floatingIconElement = getElementById('floating-icon');
    floatingIconElement.addEventListener(EVENT_LISTENERS.CLICK, function() {
        window.location.href = ROUTES.scheduleMeeting;
    });
}

// Initialize meeting cards
const filterMeetingsByName = (meetings, username) => meetings?.filter(meeting => meeting.organizerId === username);

// Function to initialize meeting cards
const initializeMeetingCards = (meetings) => {
    const myUpcomingMeetings = getElementById('my-meetings');
    if(meetings && meetings?.length){
        const fragment = document.createDocumentFragment();
        meetings?.forEach(meeting => {
            const card = createMeetingCard(meeting);
            fragment.appendChild(card);
        });
        myUpcomingMeetings.appendChild(fragment);
    } else {
        let noMeetings = createElement('p');
        noMeetings.textContent = NO_UPCOMING_MEETINGS;
        myUpcomingMeetings.appendChild(noMeetings);
    }
    
}

const createMeetingCard = (meeting) => {
    const card = createElement('card-component');
    let meetingInfoElement = `<h3>${meeting.name}</h3>`;
    Object.keys(MEETING_INFO_ICON).forEach(icon => {
        const meetingDetail = icon === 'TIME' ? `${meeting.from} - ${meeting.to}` : meeting[icon.toLowerCase()];
        meetingInfoElement += `${createMeetingInfoElement(icon, meetingDetail)}`;
    });
    card.innerHTML = meetingInfoElement;
    card.classList.add('meeting-card');
    return card;
}

const createMeetingInfoElement = (icon, meetingDetail) => `<p> <i class="fa-solid ${MEETING_INFO_ICON[icon]}"></i> ${meetingDetail} </p>`;


//Meeting Rooms
const createMeetingRoomContainer = () => {
    let meetingRoomDF = document.createDocumentFragment();
    meetingRooms.forEach(room => {
        let roomCard = createMeetingRoomCard(room);
        meetingRoomDF.appendChild(roomCard);
    });

    let meetingRoomContainer = getElementById('meeting-rooms');
    meetingRoomContainer.appendChild(meetingRoomDF);
}


const createMeetingRoomCard = (room) => {
    let meetingRoomCard = createElement('div', 'meeting-room-card');

    meetingRoomCard.addEventListener(EVENT_LISTENERS.CLICK, function(){
        window.location.href = `${ROUTES.meetingStatus}?param=${room.name}`;
    })
    let roomStatus = checkRoomStatus(room.name, new Date());
    const statusColor = roomStatus === 'Available' ? '#008f22' : '#8f0000';
    const imageContainer = createElement('div', 'image-container');
    const cardImage = createElement('img', 'card-image');
    cardImage.src = room.image;
    const roomStatusElement = createElement('div', 'room-status-container');
    const textOverlay = createElement('div', 'text-overlay');
    textOverlay.textContent = roomStatus;
    const circle = createElement('div', 'circle');
    circle.style.backgroundColor = statusColor;
    textOverlay.style.color = statusColor;
    roomStatusElement.appendChild(circle);
    roomStatusElement.appendChild(textOverlay);
    imageContainer.appendChild(cardImage);
    imageContainer.appendChild(roomStatusElement);
    const cardDetailElement = createElement('div', null, 'meeting-rooms-detail');
    const meetingRoomName = createElement('p', 'room-name');
    meetingRoomName.innerText = room.name;
    cardDetailElement.appendChild(meetingRoomName);
    meetingRoomCard.appendChild(imageContainer);
    meetingRoomCard.appendChild(cardDetailElement);
    return meetingRoomCard;
}

initializeDashboard();