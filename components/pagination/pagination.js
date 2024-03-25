import { ITEMS_PER_PAGE } from "../../constants/common-constants.js";
import { MEETING_STATUS } from "../../constants/meeting-constants.js";
import { createElement } from "../../utils/common-utils.js";
import { getCurrentDateAndTime } from "../../utils/time-utils.js";

/**
 * Initialize pagination for displaying meetings.
 * @param  meetingsDetails - Array of meeting details.
 * @param  upcomingMeetingsSection - Container for displaying upcoming meetings.
 * @param  paginationContainer - Container for pagination links.
 */
export function initializePagination(meetingsDetails, upcomingMeetingsSection, paginationContainer) {
    const currentDateObject = getCurrentDateAndTime();
    const itemsPerPage = ITEMS_PER_PAGE; 
    let currentPage = 1;

    /**
     * Display meetings for the specified page.
     * @param page - Page number to display.
     */
    function displayMeetings(page) {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        let meetings = meetingsDetails.filter(meeting => {
            if(meeting.from.replace(":", "") > currentDateObject.time) {
                return meeting;
            }
        });
        const meetingsToDisplay = meetings.slice(startIndex, endIndex);
        if(meetingsToDisplay.length == 0){
            let upcomingMeetingContainer = createElement('p','no-upcoming-meetings');
            upcomingMeetingContainer.textContent = MESSAGES.NO_UPCOMING_MEETINGS;
            upcomingMeetingsSection.appendChild(upcomingMeetingContainer);
        }

        // Clear previous meetings
        upcomingMeetingsSection.innerHTML = '';

        // Display meetings for the current page
        meetingsToDisplay.forEach(meeting => {
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
        });
    }

    /**
     * Create pagination links.
     */
    function createPagination() {
        const pageCount = Math.ceil(meetingsDetails.length / itemsPerPage);

        // Clear previous pagination
        paginationContainer.innerHTML = '';

        // Generate pagination links
        for (let i = 1; i <= pageCount; i++) {
            const listItem = createElement('li');
            const link = createElement('a');
            link.href = '#';
            link.textContent = i;
            listItem.appendChild(link);
            paginationContainer.appendChild(listItem);

            link.addEventListener('click', function(event) {
                event.preventDefault();
                currentPage = i;
                displayMeetings(currentPage);
                setActivePage(currentPage);
            });
        }

        setActivePage(currentPage);
    }
    /**
     * Set the active page in pagination.
     * @param {number} page - Page number to set as active.
     */
    function setActivePage(page) {
        const links = paginationContainer.querySelectorAll('a');
        links.forEach(link => {
            link.parentElement.classList.remove('active');
            if (parseInt(link.textContent) === page) {
                link.parentElement.classList.add('active');
            }
        });
    }

    // Call the functions to initialize pagination
    displayMeetings(currentPage);
    createPagination();
}