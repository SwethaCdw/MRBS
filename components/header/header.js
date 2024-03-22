
import { createElement, initializeUserAuth } from '../../utils/common-utils.js';
import { getUserData } from '../../services/user-service.js';
import { LOGO } from '../../constants/common-constants.js';

export const headerComponent = () => {
    const userData = getUserData();
    const { username } = initializeUserAuth();
    console.log(username);

    let nav = createElement('nav');
    let logo = createElement('img', null, 'logo');
    let profileIcon = createElement('img', null, 'profile-icon');
    let loggedInUserData = userData.find(user => user.username === username);
    console.log(loggedInUserData);
    profileIcon.src = loggedInUserData.profileImage;
    logo.src = LOGO;
    nav.appendChild(logo);
    nav.appendChild(profileIcon);
    return nav;
}