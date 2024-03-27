import { meetingRooms } from '../../services/meeting-rooms-service.js';
import { createElement, getElementById, getParameterByName, initializeUserAuth, routeTo, setHeaderSection } from '../../utils/common-utils.js';
import { EVENT_LISTENERS, MESSAGES, REFRESH_TIME} from '../../constants/common-constants.js';
import { MEETING_STATUS, MEETING_UTILITIES } from '../../constants/meeting-constants.js';
import { getMeetingDetails } from '../../utils/meeting-utils.js';
import { removeCompletedMeeting } from '../scheduler/scheduler.js';
import { ROUTES } from '../../constants/routes-constants.js';
import { getCurrentDateAndTime, splitTimeConversion } from '../../utils/time-utils.js';
import { initializePaginationForUpcomingMeetings } from '../pagination/pagination.js';

const getRoomAmenities = (meetingRooms, roomName) => meetingRooms.find(room => room.name === roomName);

const initializeMeetingStatus = () => {
    let loader = document.getElementById('loader');
    loader.style.display = 'block';
    try {
       
        // Set interval to periodically remove completed meetings
        setInterval(removeCompletedMeeting, REFRESH_TIME);
        const { isLoggedIn } = initializeUserAuth();

        // Get header element and set header section
        let header = getElementById('header');
        setHeaderSection(header);

        // Get the room name from URL parameters
        const roomName = getParameterByName('room');
        const meetingRoomName = getElementById('room-name');
        meetingRoomName.textContent = roomName;

        // Get meetings details for the specified room
        let meetingsDetails = getMeetingDetails(roomName);
        meetingsDetails = meetingsDetails ? meetingsDetails.filter(meeting => !meeting.isMeetingCompleted) : meetingsDetails;
        const upcomingMeetingsHeading = getElementById('upcoming-meetings-heading');
        upcomingMeetingsHeading.textContent = 'Upcoming Meetings';
        const upcomingMeetingsSection = getElementById('upcoming-meetings');
        const currentMeetingSection = getElementById('current-meeting');

        const currentDateObject = getCurrentDateAndTime();

        // Display current and upcoming meetings
        if (meetingsDetails && meetingsDetails.length !== 0) {
            let valueSet;
            meetingsDetails.forEach(meeting => {
                if (!valueSet) {
                    const meetingDateObject = getCurrentDateAndTime(meeting.date);
                    const meetingFrom = splitTimeConversion(meeting.from);
                    const meetingTo = splitTimeConversion(meeting.to);

                    if (currentDateObject.date.toDateString() === meetingDateObject.date.toDateString() && currentDateObject.time >= meetingFrom && currentDateObject.time <= meetingTo) {
                        // Display ongoing meeting
                        currentMeetingSection.style.backgroundColor = MEETING_STATUS.BUSY.COLOR;
                        let statusMessage = getElementById('status-message');
                        statusMessage.title = meeting.isMeetingNameVisible ? meeting.name : MEETING_STATUS.BUSY.MESSAGE;
                        const organizedByText = createElement('p');
                        organizedByText.textContent = `${MESSAGES.MEETING_ORGANIZED_BY} ${meeting.organizer}`;
                        const meetingTime = createElement('p');
                        meetingTime.textContent = `${meeting.from} - ${meeting.to}`;
                        currentMeetingSection.appendChild(organizedByText);
                        currentMeetingSection.appendChild(meetingTime);
                        valueSet = true;
                    } else {
                        // Display available
                        currentMeetingSection.style.backgroundColor = MEETING_STATUS.AVAILABLE.COLOR;
                        let statusMessage = getElementById('status-message');
                        statusMessage.textContent = MEETING_STATUS.AVAILABLE.MESSAGE;
                        statusMessage.addEventListener('mouseenter', function() {
                            this.title = this.textContent;
                          });
                    }
                }
            });

            // Initialize pagination for upcoming meetings
            const paginationContainer = getElementById('pagination-container');
            initializePaginationForUpcomingMeetings(meetingsDetails, upcomingMeetingsSection, paginationContainer);
        } else {
            // Display message when no upcoming meetings
            currentMeetingSection.style.backgroundColor = MEETING_STATUS.AVAILABLE.COLOR;
            const currentMeetingName = createElement('p');
            currentMeetingName.textContent = MEETING_STATUS.AVAILABLE.MESSAGE;
            currentMeetingSection.appendChild(currentMeetingName);
            const upcomingMeetingContainer = createElement('p', 'no-upcoming-meetings');
            upcomingMeetingContainer.textContent = MESSAGES.NO_UPCOMING_MEETINGS;
            upcomingMeetingsSection.appendChild(upcomingMeetingContainer);
        }

        // Get room amenities and display them
        const roomAmenities = getRoomAmenities(meetingRooms, roomName);
        createAmenities(roomAmenities);

        // Add button to book a room
        const meetingStatusContainer = document.querySelector('.meeting-status-container');
        const bookingRoomButton = createElement('button', 'book-button', 'book-button');
        bookingRoomButton.textContent = MESSAGES.BOOK_A_ROOM;
        meetingStatusContainer.appendChild(bookingRoomButton);
        bookingRoomButton.addEventListener(EVENT_LISTENERS.CLICK, () => {
            if (!isLoggedIn) {
                alert('You have to login to continue booking');
            }
            isLoggedIn ? routeTo(`${ROUTES.outerFolderPath}${ROUTES.scheduleMeeting}?room=${roomName}`) : routeTo(`${ROUTES.outerFolderPath}${ROUTES.login}`);
        });
    } catch (error) {
        console.error('Error occurred in initializeMeetingStatus:', error);
    } finally {
        if (loader) {
            loader.style.display = 'none';
        }
    }
};


/**
 * Create and display room amenities based on the provided data.
 * @param {Object} amenities - An object containing room amenities data.
 */
const createAmenities = (amenities) => {
    try {
        const roomAmenities = getElementById('room-amenities');
        roomAmenities.innerHTML = `
            <div class='occupancy'>
                <i class="fa-solid fa-chair"></i>
                <p>${amenities.occupancy || ''}</p>
            </div>
            ${amenities.utilities.map(utility => 
                `<div><i class="fa-solid ${MEETING_UTILITIES[utility.toUpperCase()].icon}"></i> <p>${MEETING_UTILITIES[utility.toUpperCase()].utility} </p></div>`).join('')}`;
    } catch (error) {
        console.error('Error occurred while creating room amenities:', error);
    }
};


initializeMeetingStatus();

