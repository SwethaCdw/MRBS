
import { meetingRooms } from "../../services/meeting-rooms-service.js";
import { getUserData } from "../../services/user-service.js";
import { createElement, getElementById, getParameterByName, initializeUserAuth, routeTo, setHeaderSection } from "../../utils/common-utils.js";
import { checkAvailabilityOfRoom } from "../../utils/meeting-utils.js";
import { isFromTimeLessThanToTime } from "../../utils/time-utils.js";
import { ROUTES } from "../../constants/routes-constants.js";
import { EVENT_LISTENERS, MESSAGES } from "../../constants/common-constants.js";
import { getItemFromLocalStorage, setItemInLocalStorage } from "../../utils/local-storage-utils.js";

const initializeMeetingForm = () => {

  var roomName = getParameterByName('param');
  console.log(roomName);

  //Set header section 
  const {isLoggedIn} = initializeUserAuth();
  if(isLoggedIn){
      let header = getElementById('header');
      header = setHeaderSection(header);
  }

  // Initialize meeting rooms dropdown
  initializeDropdownOptions("meetingRoomsDropdown", meetingRooms, "name", roomName);

  // Initialize organizer dropdown
  const userData = getUserData();
  initializeDropdownOptions("organizerDropdown", userData, "name");

  // Add form submission listener
  const form = getElementById('meetingForm');
  form.addEventListener(EVENT_LISTENERS.SUBMIT, handleFormSubmission);

};

const initializeDropdownOptions = (dropdownId, data, propertyName, initialValue) => {
  const dropdown = getElementById(dropdownId);
  data.forEach(item => {
    const option = createElement("option");
    option.value = item[propertyName];
    option.textContent = item[propertyName];
    if (item[propertyName] === initialValue) {
      option.selected = true;
    }
    dropdown.appendChild(option);
  });
};

const handleFormSubmission = (event) => {
  event.preventDefault();
  const form = getElementById('meetingForm');
  const meetingData = extractMeetingFormData(form);

  
  if (meetingData) {
    storeMeetingData(meetingData);
    form.reset();
    routeTo(ROUTES.meetingRooms);
  }
};

const extractMeetingFormData = (form) => {
  const userData = getUserData();
  // Extract form data
  const meetingName = form.elements.meetingName.value;
  const meetingDate = form.elements.meetingDate.value;
  const startTime = form.elements.fromTime.value;
  const endTime = form.elements.toTime.value;
  const meetingRoom = form.elements.meetingRoomsDropdown.value;
  const isMeetingNameVisible = form.elements.showMeetingName.checked;
  const meetingOrganizer = form.elements.organizerDropdown.value;

  console.log(userData,userData.find(user => user.name === meetingOrganizer),  userData.find(user => user.name === meetingOrganizer).username);

  const meetingData = {
    name: meetingName,
    date: meetingDate,
    from: startTime,
    to: endTime,
    room: meetingRoom,
    organizer: meetingOrganizer,
    organizerId: userData.find(user => user.name === meetingOrganizer).username,
    isMeetingNameVisible: isMeetingNameVisible,
    isMeetingCompleted: false
  };

  //Check if time is valid
  const isTimeValid = isFromTimeLessThanToTime(startTime, endTime);
  if (isTimeValid) {
    const error = getElementById('error');
    error.textContent = MESSAGES.START_TIME_GREATER;
    error.style.visibility = 'visible';
    return;
  }

  //Check availability of room
  const isRoomBooked = checkAvailabilityOfRoom(meetingRoom, meetingData);
  if(isRoomBooked){
    const error = getElementById('error');
    error.textContent = MESSAGES.MEETING_ALREADY_BOOKED;
    error.style.visibility = 'visible';
    return;
  }

  return meetingData;
};

const storeMeetingData = (meetingData) => {
  // Store data in local storage
  const meetings = JSON.parse(getItemFromLocalStorage('meetings')) || [];
  meetings.push(meetingData);
  setItemInLocalStorage('meetings', JSON.stringify(meetings));
  alert('Meeting data stored successfully!');
};

// Call initializeMeetingForm when the page loads
initializeMeetingForm();
