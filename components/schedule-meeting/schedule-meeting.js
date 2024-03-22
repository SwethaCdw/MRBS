import { meetingRooms } from "../../services/meeting-rooms-service.js";
import { getUserData } from "../../services/user-service.js";
import { initializeUserAuth } from "../../utils/common-utils.js";
import { getItemFromLocalStorage } from "../../utils/local-storage-utils.js";
import { headerComponent } from "../header/header.js";


const {isLoggedIn} = initializeUserAuth();
  if(isLoggedIn){
      let header = document.getElementById('header');
      header.appendChild(headerComponent());
      header.style.padding = '10px';
  }
const meetingRoomsDropdown = document.getElementById("meetingRoomsDropdown");

meetingRooms.forEach(function(room) {
  const option = document.createElement("option");
  option.value = room.name;
  option.textContent = room.name;

  meetingRoomsDropdown.appendChild(option);
});

const organizerDropdown = document.getElementById("organizerDropdown");
const userData = getUserData();

userData.forEach(function(user) {
  const option = document.createElement("option");
  option.value = user.username;
  option.textContent = user.username;

  organizerDropdown.appendChild(option);
});



const form = document.getElementById('meetingForm');

form.addEventListener('submit', function(event) {
  event.preventDefault();

  const meetingName = form.elements.meetingName.value;
  const meetingDate = form.elements.meetingDate.value;
  const fromTime = form.elements.fromTime.value;
  const toTime = form.elements.toTime.value;

  if (fromTime >= toTime) {
    alert('To time must be greater than from time.');
    event.preventDefault();
  }
  
  const meetingRoom = meetingRoomsDropdown.value;
  const isConfidential = form.elements.confidential.checked;
  const meetingOrganizer = form.elements.organizerDropdown.value;
 
  const meetingData = {
    name: meetingName,
    date: meetingDate,
    from: fromTime,
    to: toTime,
    room: meetingRoom,
    organizer: meetingOrganizer,
    confidential: isConfidential
  };

  // Store data in local storage
  const meetings = JSON.parse(localStorage.getItem('meetings')) || [];
  meetings.push(meetingData);
  localStorage.setItem('meetings', JSON.stringify(meetings));
  alert('Meeting data stored successfully!');
  form.reset();
  window.location.href = '../meeting-room-list/meeting-rooms.html';
});
