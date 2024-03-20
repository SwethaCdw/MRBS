import {getParameterByName} from '../../utils/common-utils.js';

var roomName = getParameterByName('param');
const myHeader = document.getElementById('myHeader');
myHeader.textContent = roomName;

const meetings = JSON.parse(localStorage.getItem('meetings'));

const upcomingMeetingsList = document.getElementById('upcoming-meetings');
const currentMeeting = document.getElementById('current-meeting');

let button = document.createElement('button');
button.textContent = 'Book a Room';
button.id = 'book-button';

upcomingMeetingsList.appendChild(button);


const filteredMeetings = meetings.filter(meeting => meeting.room === roomName);

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
          currentMeeting.textContent = 'Available';
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
        currentMeetingName.textContent = 'Available';
        currentMeeting.appendChild(currentMeetingName);
    }


let roomBooking = document.getElementById('book-button');

roomBooking.addEventListener('click', function(event) {
    window.location.href = '../schedule-meeting/schedule-meeting.html';
});