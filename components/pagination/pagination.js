import { EVENT_LISTENERS, ITEMS_PER_PAGE, MESSAGES } from "../../constants/common-constants.js";
import { MEETING_INFO_ICON, MEETING_STATUS } from "../../constants/meeting-constants.js";
import { createElement } from "../../utils/common-utils.js";
import { getCurrentDateAndTime, getTimeObject } from "../../utils/time-utils.js";

/**
 * Initialize pagination for displaying meetings.
 * @param  meetingsDetails - Array of meeting details.
 * @param  upcomingMeetingsSection - Container for displaying upcoming meetings.
 * @param  paginationContainer - Container for pagination links.
 */
export const initializePaginationForUpcomingMeetings = (meetingsDetails, upcomingMeetingsSection, paginationContainer) => {
    const currentDateObject = getCurrentDateAndTime();
    const itemsPerPage = ITEMS_PER_PAGE; 
    let currentPage = 1;

    let upcomingMeetings = meetingsDetails.filter(meeting => {
        if(meeting.from.replace(":", "") > currentDateObject.time) {
            return meeting;
        }
    });

    /**
     * Display meetings for the specified page.
     * @param page - Page number to display.
     */
    const displayMeetings = (page) => {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
       

        if(upcomingMeetings.length === 0){
            let upcomingMeetingContainer = createElement('p','no-upcoming-meetings');
            upcomingMeetingContainer.textContent = MESSAGES.NO_UPCOMING_MEETINGS;
            upcomingMeetingsSection.appendChild(upcomingMeetingContainer);
            return;
        }
        //Sort the upcoming meetings
        upcomingMeetings = sortUpcomingMeetings(upcomingMeetings);

        //get the meetings to display per page
        const meetingsToDisplayPerPage = upcomingMeetings.slice(startIndex, endIndex);

        // Clear previous meetings
        upcomingMeetingsSection.innerHTML = '';

            // Display meetings for the current page
            meetingsToDisplayPerPage.forEach(meeting => {
                const upcomingMeetingDetailsList = createElement('ul');
            
                const title = createElement('h4');
                title.textContent = meeting.isMeetingNameVisible ? meeting.name : MEETING_STATUS.BUSY.MESSAGE;
                upcomingMeetingDetailsList.appendChild(title);
            
                const organizerListItem = createElement('li');
                organizerListItem.innerHTML = `<i class="fa-solid ${MEETING_INFO_ICON.ORGANIZER}"></i> ${meeting.organizer}`;
                upcomingMeetingDetailsList.appendChild(organizerListItem);
            
                const timeListItem = createElement('li');
                timeListItem.innerHTML = `<i class="fa-solid ${MEETING_INFO_ICON.TIME}"></i>  ${meeting.from} - ${meeting.to}`;
                upcomingMeetingDetailsList.appendChild(timeListItem);
            
                const upcomingMeetingsContainer = createElement("div");
                upcomingMeetingsContainer.appendChild(upcomingMeetingDetailsList);
                upcomingMeetingsSection.appendChild(upcomingMeetingsContainer);
            });
    }

    /**
     * Create pagination links.
     */
    const createPagination = () => {
        const pageCount = Math.ceil(upcomingMeetings.length / itemsPerPage);

        // Clear previous pagination
        paginationContainer.innerHTML = '';

        // Generate pagination links
        for (let i = 1; i <= pageCount; i++) {
            const listItem = createElement('li');
            const link = createElement('a');
            link.href = '#';
            link.textContent = i;
            listItem.appendChild(link);
            if(pageCount > 1){
                paginationContainer.appendChild(listItem);
            }

            link.addEventListener(EVENT_LISTENERS.CLICK, (event) => {
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
    const setActivePage = (page) => {
        const links = paginationContainer.querySelectorAll('a');
        links.forEach(link => {
            link.parentElement.classList.remove('active');
            if (parseInt(link.textContent) === page) {
                link.parentElement.classList.add('active');
            }
        });
    }

    const sortUpcomingMeetings = (upcomingMeetings) => {
        upcomingMeetings.sort((a, b) => {
            // Compare dates first
            const dateComparison = new Date(a.date) - new Date(b.date);
            if (dateComparison !== 0) {
                return dateComparison;
            }
        
            // If dates are the same, compare times
            const timeComparison = getTimeObject(a.date, a.from) - getTimeObject(b.date, b.from);
            return timeComparison;
        });
        return upcomingMeetings;
    }

    // Call the functions to initialize pagination
    displayMeetings(currentPage);
    createPagination();
}