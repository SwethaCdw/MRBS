import { EVENT_LISTENERS, MESSAGES, REFRESH_TIME } from "../../constants/common-constants.js";
import { MEETING_INFO_ICON} from "../../constants/meeting-constants.js";
import { getElementById, initializeUserAuth, createElement, routeTo, setHeaderSection } from "../../utils/common-utils.js";
import { meetingRooms } from "../../services/meeting-rooms-service.js";
import { ROUTES } from "../../constants/routes-constants.js";
import { getItemFromLocalStorage } from "../../utils/local-storage-utils.js";
import { removeCompletedMeeting } from "../scheduler/scheduler.js";
import { checkAvailabilityOfRoom, filterMeetingsByUserName } from "../../utils/meeting-utils.js";


/**
 * Initializes the dashboard view.
 * Sets up the dashboard by fetching and displaying upcoming meetings,
 * meeting room cards, and adding event listeners.
 */
const initializeDashboard = () => {
    try {
        setInterval(removeCompletedMeeting, REFRESH_TIME);

        const { username } = initializeUserAuth();
        const meetings = JSON.parse(getItemFromLocalStorage('meetings'));

        //Get header component
        let header = getElementById('header');
        setHeaderSection(header);

        //Filter meetings based on username
        const filteredMeetings = filterMeetingsByUserName(meetings, username)?.filter(meeting => !meeting.isMeetingCompleted);

        //Initialize Upcoming meeting cards
        initializeMeetingCards(filteredMeetings);

        //Initialize Meeting room cards
        createMeetingRoomContainer();

        //Icon for moving to schedule form
        const floatingIconElement = getElementById('floating-icon');
        floatingIconElement.addEventListener(EVENT_LISTENERS.CLICK, () => {
            routeTo(ROUTES.scheduleMeeting);
        });
    } catch (error) {
        console.error('Error occurred in initializeDashboard:', error);
    }
}

/**
 * Function to initialize meeting cards
 * @param {*} meetings 
 */
const initializeMeetingCards = (meetings) => {
    try {
        // Get the container element for upcoming meetings
        const myUpcomingMeetings = getElementById('my-meetings');
        
        // Check if there are meetings and if the meetings array is not empty
        if (meetings && meetings?.length) {
            // Create a document fragment to efficiently append multiple elements
            const fragment = document.createDocumentFragment();
            
            // Loop through each meeting and create a card for it
            meetings?.forEach(meeting => {
                const card = createMeetingCard(meeting);
                fragment.appendChild(card);
            });            
            myUpcomingMeetings.appendChild(fragment);
        } else {
            // If there are no meetings, display a message indicating so
            let noMeetings = createElement('p');
            noMeetings.textContent = MESSAGES.NO_UPCOMING_MEETINGS;
            myUpcomingMeetings.appendChild(noMeetings);
        }
    } catch (error) {
        console.error('Error occurred in initializeMeetingCards:', error);
    }
}

const createMeetingCard = (meeting) => {
    try {
        // Create a new card component element
        const card = createElement('card-component');
        
        // Initialize the meeting info element with the meeting name
        let meetingInfoElement = `<h3>${meeting.name}</h3>`;
        
        // Iterate over each key in MEETING_INFO_ICON
        Object.keys(MEETING_INFO_ICON).forEach(icon => {
            // Get the meeting detail for the current icon
            const meetingDetail = icon === 'TIME' ? `${meeting.from} - ${meeting.to}` : meeting[icon.toLowerCase()];
            meetingInfoElement += `${createMeetingInfoElement(icon, meetingDetail)}`;
        });
        card.innerHTML = meetingInfoElement;
        card.classList.add('meeting-card');
        
        return card;
    } catch (error) {
        console.error('Error occurred in createMeetingCard:', error);
        return null;
    }
}

const createMeetingInfoElement = (icon, meetingDetail) => `<p> <i class="fa-solid ${MEETING_INFO_ICON[icon]}"></i> ${meetingDetail} </p>`;

/**
 * Create Meeting Rooms Container
 */
const createMeetingRoomContainer = () => {
    try {
        // Create a new document fragment to hold the meeting room cards
        let meetingRoomDF = document.createDocumentFragment();
        
        // Iterate over each meeting room and create a card for it
        meetingRooms.forEach(room => {
            let roomCard = createMeetingRoomCard(room);
            meetingRoomDF.appendChild(roomCard);
        });

        let meetingRoomContainer = getElementById('meeting-rooms');
        meetingRoomContainer.appendChild(meetingRoomDF);
    } catch (error) {
        console.error('Error occurred in createMeetingRoomContainer:', error);
    }
}

/**
 * Create meeting room cards
 * @param {*} room 
 * @returns 
 */
const createMeetingRoomCard = (room) => {
    try {
        // Create a div element to represent the meeting room card
        let meetingRoomCard = createElement('div', 'meeting-room-card');

        // Add click event listener to the card to navigate to meeting status page
        meetingRoomCard.addEventListener(EVENT_LISTENERS.CLICK, () => {
            routeTo(`${ROUTES.meetingStatus}?room=${room.name}`);
        });

        // Check the availability of the room and set the status color accordingly
        let roomStatus = checkAvailabilityOfRoom(room.name);
        const statusColor = !roomStatus ? '#008f22' : '#8f0000';

        // Create elements for room image and status for room
        const imageContainer = createElement('div', 'image-container');
        const cardImage = createElement('img', 'card-image');
        cardImage.src = room.image;
        const roomStatusElement = createElement('div', 'room-status-container');

        // Create text overlay and colored circle for room status
        const textOverlay = createElement('div', 'text-overlay');
        textOverlay.textContent = !roomStatus ? 'Available' : 'Busy';
        textOverlay.style.color = statusColor;
        const circle = createElement('div', 'circle');
        circle.style.backgroundColor = statusColor;

        // Append status elements to room status container
        roomStatusElement.appendChild(circle);
        roomStatusElement.appendChild(textOverlay);

        // Append image container and room detail elements to meeting room card
        imageContainer.appendChild(cardImage);
        imageContainer.appendChild(roomStatusElement);
        const cardDetailElement = createElement('div', null, 'meeting-rooms-detail');
        const meetingRoomName = createElement('p', 'room-name');
        meetingRoomName.innerText = room.name;
        cardDetailElement.appendChild(meetingRoomName);
        meetingRoomCard.appendChild(imageContainer);
        meetingRoomCard.appendChild(cardDetailElement);

        return meetingRoomCard;
    } catch (error) {
        console.error('Error occurred in createMeetingRoomCard:', error);
        return null;
    }
}

const { isLoggedIn } = initializeUserAuth();
isLoggedIn ? initializeDashboard() : routeTo(ROUTES.login);
