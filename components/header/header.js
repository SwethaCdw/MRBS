import { createElement, initializeUserAuth, routeTo } from '../../utils/common-utils.js';
import { getUserData } from '../../services/user-service.js';
import { EVENT_LISTENERS, LOGO } from '../../constants/common-constants.js';
import { logout } from '../logout/logout.js';
import { ROUTES } from '../../constants/routes-constants.js';

export const headerComponent = () => {
    const { isLoggedIn, username } = initializeUserAuth();
    const userData = getUserData();
    const loggedInUserData = userData.find(user => user.username === username);

    const nav = createElement('nav');
    const logo = createElement('img', null, 'logo');
    const profileIcon = createElement('img', null, 'profile-icon');
    const dropdownContent = createElement('div', null, 'dropdown-content');
    const logoutLink = createElement('a', 'routeLink');
    const dashboardLink = createElement('a', 'routeLink');

    // Set logo source
    logo.src = LOGO;
    nav.appendChild(logo);

    if (isLoggedIn) {
        // Set profile icon source and click event listener
        profileIcon.src = loggedInUserData.profileImage;
        profileIcon.addEventListener(EVENT_LISTENERS.CLICK, () => {
            dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
        });
        nav.appendChild(profileIcon);

        // Set logout link properties and click event listener
        logoutLink.href = '#';
        logoutLink.textContent = 'Logout';
        logoutLink.addEventListener(EVENT_LISTENERS.CLICK, logout);

        dashboardLink.href = '#';
        dashboardLink.textContent = 'Dashboard';
        dashboardLink.addEventListener(EVENT_LISTENERS.CLICK, () => {
            routeTo(ROUTES.dashboard);
        });

        logoutLink.style.textDecoration = 'none';
        logoutLink.style.color = '#000';
        logoutLink.style.display = 'flex';
        logoutLink.style.alignItems = 'center';

        dashboardLink.style.textDecoration = 'none';
        dashboardLink.style.color = '#000';
        dashboardLink.style.display = 'flex';
        dashboardLink.style.alignItems = 'center';
        dashboardLink.style.paddingBottom = '10px';

        

        // Append logout link to dropdown content
        dropdownContent.appendChild(dashboardLink);
        dropdownContent.appendChild(logoutLink);
        dropdownContent.style.display = 'none'; // Initially hidden
        dropdownContent.classList.add('dropdown-content');
        dropdownContent.style.position = 'absolute';
        dropdownContent.style.top = '10%';
        dropdownContent.style.right = '10px';
        dropdownContent.style.backgroundColor = '#fff';
        dropdownContent.style.border = '1px solid #ccc';
        dropdownContent.style.padding = '10px';
        dropdownContent.style.display = 'none'; // Initially hidden
        dropdownContent.style.zIndex = '1';

        // Append dropdown content to nav
        nav.appendChild(dropdownContent);

        // Hide dropdown content when clicking outside profile icon
        document.addEventListener(EVENT_LISTENERS.CLICK, (event) => {
            if (!profileIcon.contains(event.target)) {
                dropdownContent.style.display = 'none';
            }
        });
    }

    return nav;
};