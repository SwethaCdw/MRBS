import { getItemFromLocalStorage } from "./local-storage-utils.js";
import { LOCAL_STORAGE_KEYS } from "../constants/common-constants.js";

export const getParameterByName = (name) => {
    name = name.replace(/[[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

export const initializeUserAuth = () =>{
    const isLoggedIn = getItemFromLocalStorage(LOCAL_STORAGE_KEYS.IS_LOGGED_IN) === 'true';
    const username = getItemFromLocalStorage(LOCAL_STORAGE_KEYS.USERNAME)
    return { isLoggedIn, username };
}

export const createElement = (tag, className, idName) => {
    let element = document.createElement(tag);
    className ? element.classList.add(className) : element;
    idName ? element.id = idName : element;
    return element;
}