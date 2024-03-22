import { getUserData } from "../../services/user-service.js";
import { getItemFromLocalStorage, removeItemFromLocalStorage, setItemInLocalStorage } from '../../utils/local-storage-utils.js';
import { LOCAL_STORAGE_KEYS, LOGO } from '../../constants/common-constants.js';
import { validateEmail } from '../../utils/validation-utils.js';
import { initializeUserAuth } from "../../utils/common-utils.js";

const userData = getUserData();

const form = document.getElementById("loginForm");
const errorElement = document.getElementById("error");

let logo = document.getElementById('logo');
logo.src = LOGO;

form.addEventListener("submit", function(event) {
    let {isLoggedIn, username} = initializeUserAuth();
    event.preventDefault();
    username = form.username.value;
    const password = form.password.value;

    if (isValidUser(username, password)) {
        isLoggedIn = true;
        setItemInLocalStorage(LOCAL_STORAGE_KEYS.IS_LOGGED_IN, 'true');
        setItemInLocalStorage(LOCAL_STORAGE_KEYS.USERNAME, username);
        window.location.href = "../dashboard/dashboard.html";
    } else {
        errorElement.textContent = "Invalid username or password";
        errorElement.style.display = "block";        
    }
    
});


const isValidUser = (username, password) => {
    const user = userData.find(user => user.username === username && user.password === password);
    return !!user;
};


const viewRooms = document.getElementById("view-rooms");

viewRooms.addEventListener("click", function() {
    window.location.href = '../meeting-room-list/meeting-rooms.html';
  });

