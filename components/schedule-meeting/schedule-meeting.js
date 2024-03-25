
import { meetingRooms } from "../../services/meeting-rooms-service.js";
import { getUserData } from "../../services/user-service.js";
import { getElementById, getParameterByName, initializeDropdownOptions, initializeUserAuth, routeTo, setHeaderSection } from "../../utils/common-utils.js";
import { checkAvailabilityOfRoom } from "../../utils/meeting-utils.js";
import { isFromTimeLessThanToTime, isTimeGreaterThanCurrentTime } from "../../utils/time-utils.js";
import { ROUTES } from "../../constants/routes-constants.js";
import { EVENT_LISTENERS, MESSAGES } from "../../constants/common-constants.js";
import { getItemFromLocalStorage, setItemInLocalStorage } from "../../utils/local-storage-utils.js";

/**
 * Initializes the meeting form.
 * Sets up the form with dropdown options for meeting rooms and organizers,
 * and adds a form submission listener.
 */
const initializeMeetingForm = () => {
  try {
      const roomName = getParameterByName('param');

      // Set header section if user is logged in
      let header = getElementById('header');
      header = setHeaderSection(header);

      // Initialize meeting rooms dropdown
      initializeDropdownOptions("meetingRoomsDropdown", meetingRooms, "name", roomName);

      // Initialize organizer dropdown
      const userData = getUserData();
      initializeDropdownOptions("organizerDropdown", userData, "name");

      // Add form submission listener
      const form = getElementById('meetingForm');
      form.addEventListener(EVENT_LISTENERS.SUBMIT, handleFormSubmission);
  } catch (error) {
      console.error('Error occurred during meeting form initialization:', error);
  }
};


/**
 * Handles the submission of the meeting form.
 * @param {Event} event - The event object.
 */
const handleFormSubmission = (event) => {
  try {
      event.preventDefault();
      const form = getElementById('meetingForm');
      const meetingData = extractMeetingFormData(form);

      if (meetingData) {
          storeMeetingData(meetingData);
          form.reset();
          routeTo(ROUTES.meetingRooms);
      }
  } catch (error) {
      console.error('Error occurred during form submission handling:', error);
  }
};

/**
 * Extracts meeting form data.
 * @param form - The meeting form element.
 * @returns meetingData- The extracted meeting data, or null if there's an error.
 */
const extractMeetingFormData = (form) => {
  try {
      const userData = getUserData();
      // Extract form data
      const meetingName = form.elements.meetingName.value;
      const meetingDate = form.elements.meetingDate.value;
      const startTime = form.elements.fromTime.value;
      const endTime = form.elements.toTime.value;
      const meetingRoom = form.elements.meetingRoomsDropdown.value;
      const isMeetingNameVisible = form.elements.showMeetingName.checked;
      const meetingOrganizer = form.elements.organizerDropdown.value;

      // Find organizer's username from user data
      const organizerUser = userData.find(user => user.name === meetingOrganizer);
      const organizerId = organizerUser ? organizerUser.username : '';

      const meetingData = {
          name: meetingName,
          date: meetingDate,
          from: startTime,
          to: endTime,
          room: meetingRoom,
          organizer: meetingOrganizer,
          organizerId: organizerId,
          isMeetingNameVisible: isMeetingNameVisible,
          isMeetingCompleted: false
      };

      //Check if time is valid
      const isTimeValid = isFromTimeLessThanToTime(startTime, endTime) && isTimeGreaterThanCurrentTime(startTime, meetingDate);
      if (isTimeValid) {
          const error = getElementById('error');
          error.textContent = MESSAGES.START_TIME_GREATER;
          error.style.visibility = 'visible';
          return null;
      }

      //Check availability of room
      const isRoomBooked = checkAvailabilityOfRoom(meetingRoom, meetingData);
      if (isRoomBooked) {
          const error = getElementById('error');
          error.textContent = MESSAGES.MEETING_ALREADY_BOOKED;
          error.style.visibility = 'visible';
          return null;
      }

      return meetingData;
  } catch (error) {
      console.error('Error occurred while extracting meeting form data:', error);
      return null;
  }
};
/**
 * Stores meeting data in local storage.
 * @param meetingData - The meeting data to be stored.
 */
const storeMeetingData = (meetingData) => {
  try {
      const meetings = JSON.parse(getItemFromLocalStorage('meetings')) || [];
      meetings.push(meetingData);
      setItemInLocalStorage('meetings', JSON.stringify(meetings));
      alert('Meeting data stored successfully!');
  } catch (error) {
      console.error('Error occurred while storing meeting data:', error);
  }
};


const { isLoggedIn } = initializeUserAuth();
isLoggedIn ? initializeMeetingForm() : routeTo(ROUTES.login);

