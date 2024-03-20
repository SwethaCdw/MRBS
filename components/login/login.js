import { getUserData } from "../../services/user-service.js";
import { getItemFromLocalStorage, removeItemFromLocalStorage, setItemInLocalStorage } from '../../utils/local-storage-utils.js';
import { LOCAL_STORAGE_KEYS } from '../../constants/common-constants.js'


let isLoggedIn;
let username;
const userData = getUserData();

const form = document.getElementById("loginForm");
const errorElement = document.getElementById("error");

const initializeUserAuth = () =>{
    isLoggedIn = getItemFromLocalStorage(LOCAL_STORAGE_KEYS.IS_LOGGED_IN) === 'true';
    username = getItemFromLocalStorage(LOCAL_STORAGE_KEYS.USERNAME)
}

form.addEventListener("submit", function(event) {
    event.preventDefault();
    initializeUserAuth();
    username = form.username.value;
    const password = form.password.value;

    if (isValidUser(username, password)) {
        isLoggedIn = true;
        setItemInLocalStorage(LOCAL_STORAGE_KEYS.IS_LOGGED_IN, 'true');
        setItemInLocalStorage(LOCAL_STORAGE_KEYS.USERNAME, username);
        window.location.href = "../schedule-meeting/schedule-meeting.html";
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
    window.location.href = '../meeting-rooms/meeting-rooms.html';
  });

