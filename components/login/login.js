import { setItemInLocalStorage } from '../../utils/local-storage-utils.js';
import { EVENT_LISTENERS, LOCAL_STORAGE_KEYS, LOGO } from '../../constants/common-constants.js';
import { isValidUser, validateEmail, validatePassword } from '../../utils/validation-utils.js';
import { getElementById, initializeUserAuth, routeTo } from "../../utils/common-utils.js";
import { ROUTES } from "../../constants/routes-constants.js";


const initializeLogin = () => {
    try {
        let { isLoggedIn, username } = initializeUserAuth();  
    
        // Check if user is already logged in
        if (isLoggedIn) {
            // Redirect to dashboard if user is logged in
            routeTo(ROUTES.dashboard);
        } else {
            // Get form and error elements
            const form = getElementById("loginForm");
            const errorElement = getElementById("error");

            // Set logo source
            const logo = getElementById('logo');
            logo.src = LOGO;

            // Function to disable/enable login button based on username and password validity
            const toggleLoginButton = () => {
                const submitFormButton = getElementById("submit-form-btn");
                const isUsernameValid = validateEmail(form.username.value);
                const isPasswordValid = validatePassword(form.password.value);
                submitFormButton.disabled = !(isUsernameValid && isPasswordValid);
            }

            // Add input event listeners to username and password inputs
            const passwordInput = getElementById("password");
            const userName = getElementById("username");
            userName.addEventListener(EVENT_LISTENERS.INPUT, toggleLoginButton);
            passwordInput.addEventListener(EVENT_LISTENERS.INPUT, toggleLoginButton);

            // Add submit event listener to login form
            form.addEventListener(EVENT_LISTENERS.SUBMIT, function(event) {
                event.preventDefault();
                // Get username and password from form inputs
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

            // Add click event listener to "view rooms" link
            const viewRooms = getElementById("view-rooms");
            viewRooms.addEventListener(EVENT_LISTENERS.CLICK, function() {
                routeTo(ROUTES.meetingRooms);
            });
        }
    } catch (error) {
        console.error('Error occurred in initializeLogin:', error);
    }
};
initializeLogin();
