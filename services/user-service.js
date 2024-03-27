import { getItemFromLocalStorage, setItemInLocalStorage } from "../utils/local-storage-utils.js";
import { LOCAL_STORAGE_KEYS } from "../constants/common-constants.js";
/**
 * Fetch the user data from JSON
 */
const usersData = await fetch('../../resources/users.json')
.then(response => response.json())
.then(data => {
    return data;
})
.catch(error => console.error('Error reading JSON file:', error));

export const getUserData = () => {
    setItemInLocalStorage(LOCAL_STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(usersData));
    return JSON.parse(getItemFromLocalStorage(LOCAL_STORAGE_KEYS.REGISTERED_USERS));
}