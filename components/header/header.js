import { createElement, initializeUserAuth, routeTo } from '../../utils/common-utils.js';
import { getUserData } from '../../services/user-service.js';
import { EVENT_LISTENERS, LOGO } from '../../constants/common-constants.js';
import { logout } from '../logout/logout.js';
import { ROUTES } from '../../constants/routes-constants.js';

export const headerComponent = () => {
    try {
        // Retrieve user authentication information
        const { isLoggedIn, username } = initializeUserAuth();
        const userData = getUserData();
        const loggedInUserData = userData.find(user => user.username === username);

        const nav = createElement('nav');
        
        // Create logo element and set its source
        const logo = createElement('img', null, 'logo');
        logo.src = LOGO;
        nav.appendChild(logo);

        // Check if user is logged in
        if (isLoggedIn) {
            // Create profile icon element and click event listener
            const profileIcon = createElement('img', null, 'profile-icon');
            profileIcon.src = loggedInUserData.profileImage;
            profileIcon.addEventListener(EVENT_LISTENERS.CLICK, () => {
                dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
            });
            nav.appendChild(profileIcon);

            // Create logout link element and set its properties and click event listener
            const logoutLink = createElement('a', 'routeLink');
            logoutLink.href = '#';
            logoutLink.textContent = 'Logout';
            logoutLink.addEventListener(EVENT_LISTENERS.CLICK, logout);

            // Create dashboard link element and set its properties and click event listener
            const dashboardLink = createElement('a', 'routeLink');
            dashboardLink.href = '#';
            dashboardLink.textContent = 'Dashboard';
            dashboardLink.addEventListener(EVENT_LISTENERS.CLICK, () => {
                routeTo(ROUTES.dashboard);
            });

            // Apply styling to links
            [logoutLink, dashboardLink].forEach(link => {
                link.style.textDecoration = 'none';
                link.style.color = '#000';
                link.style.display = 'flex';
                link.style.alignItems = 'center';
                if (link === dashboardLink) {
                    link.style.paddingBottom = '10px';
                }
            });

            // Create dropdown content element and append logout and dashboard links
            const dropdownContent = createElement('div', null, 'dropdown-content');
            dropdownContent.appendChild(dashboardLink);
            dropdownContent.appendChild(logoutLink);
            dropdownStyling(dropdownContent);
            nav.appendChild(dropdownContent);

            // Hide dropdown content when clicking outside profile icon
            document.addEventListener(EVENT_LISTENERS.CLICK, (event) => {
                if (!profileIcon.contains(event.target)) {
                    dropdownContent.style.display = 'none';
                }
            });
        }
        return nav;
    } catch (error) {
        console.error('Error occurred in headerComponent:', error);
        return null;
    }
};


const dropdownStyling = (dropdownContent) => {
    dropdownContent.style.display = 'none';
    dropdownContent.classList.add('dropdown-content');
    dropdownContent.style.position = 'absolute';
    dropdownContent.style.top = '10%';
    dropdownContent.style.right = '10px';
    dropdownContent.style.backgroundColor = '#fff';
    dropdownContent.style.border = '1px solid #ccc';
    dropdownContent.style.padding = '10px';
    dropdownContent.style.zIndex = '1';
}