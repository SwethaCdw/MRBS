import { meetingRooms } from '../../services/meeting-rooms-service.js';
import { createElement, getElementById, getParameterByName, initializeUserAuth, routeTo, setHeaderSection } from '../../utils/common-utils.js';
import { EVENT_LISTENERS, MEETING_STATUS, MEETING_UTILITIES, MESSAGES} from '../../constants/common-constants.js';
import { getMeetingDetails } from '../../utils/meeting-utils.js';
import { removeCompletedMeeting } from '../scheduler/scheduler.js';
import { ROUTES } from '../../constants/routes-constants.js';
import { getCurrentDateAndTime, splitTimeConversion } from '../../utils/time-utils.js';

const getRoomAmenities = (meetingRooms, roomName) => meetingRooms.find(room => room.name === roomName);

const initializeMeetingStatus = () => {
    setInterval(removeCompletedMeeting, 10000);

    const { isLoggedIn } = initializeUserAuth();
    let header = getElementById('header');
    setHeaderSection(header);

    //Room name
    var roomName = getParameterByName('param');
    const meetingRoomName = getElementById('room-name');
    meetingRoomName.textContent = roomName;

    //Filter meetings based on room name
    let meetingsDetails = getMeetingDetails(roomName);
    meetingsDetails = meetingsDetails ? meetingsDetails.filter(meeting => !meeting.isMeetingCompleted) : meetingsDetails;

    const upcomingMeetingsSection = getElementById('upcoming-meetings');
    const currentMeetingSection = getElementById('current-meeting');

    const currentDateObject = getCurrentDateAndTime();

    console.log('Hello');

        console.log(meetingsDetails);
    if(meetingsDetails && meetingsDetails?.length != 0){
        let valueSet;
        console.log('Hi');
        meetingsDetails?.forEach( meeting => {
            if(!valueSet) {
                const meetingDateObject = getCurrentDateAndTime(meeting.date);

                const meetingFrom = splitTimeConversion(meeting.from);
                const meetingTo = splitTimeConversion(meeting.to);
                if (currentDateObject.date.toDateString() === meetingDateObject.date.toDateString() && currentDateObject.time >= meetingFrom && currentDateObject.time <= meetingTo) {
    
                    console.log('IN if');
                    // Current meeting is ongoing
                    currentMeetingSection.style.backgroundColor = MEETING_STATUS.BUSY.COLOR;
                
                    const currentMeetingName = createElement('h3');
                    currentMeetingName.textContent = meeting.isMeetingNameVisible ? meeting.name : MEETING_STATUS.BUSY.MESSAGE;
                
                    const organizedByText = createElement('p');
                    organizedByText.textContent = `${MESSAGES.MEETING_ORGANIZED_BY} ${meeting.organizer}`;

                    const meetingTime = createElement('p');
                    meetingTime.textContent = `${meeting.from} - ${meeting.to}`;
                
                    currentMeetingSection.appendChild(currentMeetingName);
                    currentMeetingSection.appendChild(organizedByText);
                    currentMeetingSection.appendChild(meetingTime);
                    valueSet = true;
                } else {
                    console.log("In else");
                    // Room is available or there are upcoming meetings
                    currentMeetingSection.style.backgroundColor = MEETING_STATUS.AVAILABLE.COLOR;
                    currentMeetingSection.textContent = MEETING_STATUS.AVAILABLE.MESSAGE;
                
                }       
            }      
        });
        //Set upcoming meetings
        meetingsDetails?.forEach( meeting => {
            console.log(meeting.from.replace(":", ""), currentDateObject.time);
            if(meeting.from.replace(":", "") > currentDateObject.time) {
                const upcomingMeetingsContainer = createElement("div");
                const upcomingMeetingDetailsList = createElement('ul');
            
                const upcomingMeetingItems = [
                    { title: meeting.isMeetingNameVisible ? meeting.name :  MEETING_STATUS.BUSY.MESSAGE },
                    { details: meeting.organizer },
                    { details: `${meeting.from}-${meeting.to}` }
                ];
                upcomingMeetingItems.forEach(item => {
                    const title = createElement('h4');
                    title.textContent = item.title;
            
                    const listItem = createElement('li');
                    listItem.textContent = item.details;
            
                    upcomingMeetingDetailsList.appendChild(title);
                    upcomingMeetingDetailsList.appendChild(listItem);
                });
            
                upcomingMeetingsContainer.appendChild(upcomingMeetingDetailsList);
                upcomingMeetingsSection.appendChild(upcomingMeetingsContainer);
            }
        })
    } else {
            currentMeetingSection.style.backgroundColor = MEETING_STATUS.AVAILABLE.COLOR;
            let currentMeetingName = createElement('p');
            currentMeetingName.textContent = MEETING_STATUS.AVAILABLE.MESSAGE;
            currentMeetingSection.appendChild(currentMeetingName);

            let upcomingMeetingContainer = createElement('p','no-upcoming-meetings');
            upcomingMeetingContainer.textContent = MESSAGES.NO_UPCOMING_MEETINGS;
            upcomingMeetingsSection.appendChild(upcomingMeetingContainer);
    }


    //Room amenities
    const roomAmenities = getRoomAmenities(meetingRooms, roomName);
    createAmenities(roomAmenities);

    //Book a room button
    let bookingRoomButton = createElement('button');
    bookingRoomButton.textContent = MESSAGES.BOOK_A_ROOM;
    bookingRoomButton.id = 'book-button';
    upcomingMeetingsSection.appendChild(bookingRoomButton);

    bookingRoomButton.addEventListener(EVENT_LISTENERS.CLICK, function() {
        if(!isLoggedIn){
            alert('You have to login to continue booking');
        }
        isLoggedIn ? routeTo(`${ROUTES.scheduleMeeting}?param=${roomName}`) : routeTo(ROUTES.login);
    });

}

const createAmenities = (amenities) => {
    const roomAmenities = getElementById('room-amenities');
    roomAmenities.innerHTML = `
        <div class='occupancy'>
            <i class="fa-solid fa-chair"></i>
            <p>${amenities.occupancy || ''}</p>
        </div>
        ${amenities.utilities.map(utility => 
            `<div><i class="fa-solid ${MEETING_UTILITIES[utility.toUpperCase()].icon}"></i> <p>${MEETING_UTILITIES[utility.toUpperCase()].utility} </p></div>`).join('')}`;

}

initializeMeetingStatus();

