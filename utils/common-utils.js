import { getItemFromLocalStorage } from "./local-storage-utils.js";
import { LOCAL_STORAGE_KEYS } from "../constants/common-constants.js";
import { headerComponent } from "../components/header/header.js";

/**
 * Retrieves the value of a URL parameter by name.
 * @param name - The name of the parameter to retrieve.
 * @returns The value of the parameter if found, or an empty string if not found.
 */
export const getParameterByName = (name) => {
    const regex = new RegExp(`[?&]${name}=([^&#]*)`);
    const results = regex.exec(location.search);
    return results ? decodeURIComponent(results[1].replace(/\+/g, " ")) : "";
}

/**
 * Initializes user authentication status by retrieving user data from local storage.
 * @returns An object containing the user's authentication status and username.
 */
export const initializeUserAuth = () =>{
    const isLoggedIn = getItemFromLocalStorage(LOCAL_STORAGE_KEYS.IS_LOGGED_IN) === 'true';
    const username = getItemFromLocalStorage(LOCAL_STORAGE_KEYS.USERNAME)
    return { isLoggedIn, username };
}

/**
 * Creates a new HTML element with the specified tag, optional class name, and optional ID.
 * @param tag - The HTML tag name for the element.
 * @param className - Optional class name to add to the element.
 * @param idName- Optional ID to assign to the element.
 * @returns The newly created HTML element.
 */
export const createElement = (tag, className, idName) => {
    try{
        let element = document.createElement(tag);
        className ? element.classList.add(className) : element;
        idName ? element.id = idName : element;
        return element;
    } catch (error) {
        console.error('Error occurred during element creation:', error);
        return null;
    }
   
}
/**
 * Get element by id
 * @param {*} id 
 * @returns 
 */
export const getElementById = (id) => document.getElementById(id);

/**
 * Set header section for all pages
 * @param {*} header 
 * @returns 
 */
export const setHeaderSection = (header) => {
    header.appendChild(headerComponent());
    header.style.padding = '10px';
    return header;
}

/**
 * Navigate to the given location url
 * @param {*} location 
 */
export const routeTo = (location) => {
    window.location.href = location;
}

/**
 * Initializes dropdown options for a select element.
 * Optionally sets the selected option based on the initialValue.
 * @param dropdownId - The ID of the select element.
 * @param data - The array of objects containing the options data.
 * @param propertyName - The name of the property
 * @param initialValue - The initial value to be selected in the dropdown
 */
export const initializeDropdownOptions = (dropdownId, data, propertyName, initialValue) => {
    try {
        const dropdown = getElementById(dropdownId);
        data.forEach(item => {
            const option = createElement("option");
            option.value = item[propertyName];
            option.textContent = item[propertyName];
            if (item[propertyName] === initialValue) {
                option.selected = true;
            }
            dropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Error occurred during dropdown options initialization:', error);
    }
};