import { setItemInLocalStorage } from '../../utils/local-storage-utils.js';
import { EVENT_LISTENERS, LOCAL_STORAGE_KEYS, LOGO } from '../../constants/common-constants.js';
import { isValidUser, validateEmail, validatePassword } from '../../utils/validation-utils.js';
import { getElementById, initializeUserAuth, routeTo } from "../../utils/common-utils.js";
import { ROUTES } from "../../constants/routes-constants.js";


const initializeLogin = () => {
    let { isLoggedIn, username } = initializeUserAuth();  
    
    //If user is already logged in
    if (isLoggedIn) {
        routeTo(ROUTES.dashboard);
    } else {
        const form = getElementById("loginForm");
        const errorElement = getElementById("error");

        let logo = getElementById('logo');
        logo.src = LOGO;

        //Disable login button when username and password is invalid
        const toggleLoginButton = () => {
            const submitFormButton = getElementById("submit-form-btn");
            const isUsernameValid = validateEmail(form.username.value);
            const isPasswordValid = validatePassword(form.password.value);
            submitFormButton.disabled = !(isUsernameValid && isPasswordValid);
        }

        const passwordInput = getElementById("password");
        const userName = getElementById("username");
        userName.addEventListener(EVENT_LISTENERS.INPUT, toggleLoginButton);
        passwordInput.addEventListener(EVENT_LISTENERS.INPUT, toggleLoginButton);

        //On click on login button
        form.addEventListener(EVENT_LISTENERS.SUBMIT, function(event) {
            event.preventDefault();
            username = form.username.value;
            const password = form.password.value;

            if (isValidUser(username, password)) {
                isLoggedIn = true;
                setItemInLocalStorage(LOCAL_STORAGE_KEYS.IS_LOGGED_IN, 'true');
                setItemInLocalStorage(LOCAL_STORAGE_KEYS.USERNAME, username);
                routeTo(ROUTES.dashboard);
            } else {
                errorElement.style.visibility = "visible";        
            }
        });

        //When clicked on view rooms
        const viewRooms = getElementById("view-rooms");
        viewRooms.addEventListener(EVENT_LISTENERS.CLICK, function() {
            routeTo(ROUTES.meetingRooms);
        });

    }
};


initializeLogin();
