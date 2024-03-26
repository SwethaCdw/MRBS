import { LOCAL_STORAGE_KEYS } from "../../constants/common-constants.js";
import { ROUTES } from "../../constants/routes-constants.js";
import { initializeUserAuth, routeTo } from "../../utils/common-utils.js"
import { removeItemFromLocalStorage } from "../../utils/local-storage-utils.js";


export const logout = () => {
    try {
        let { isLoggedIn } = initializeUserAuth();
        isLoggedIn = false;

        // Remove login-related items from local storage
        removeItemFromLocalStorage(LOCAL_STORAGE_KEYS.IS_LOGGED_IN);
        removeItemFromLocalStorage(LOCAL_STORAGE_KEYS.USERNAME);

        // Redirect to the login page
        routeTo(`${ROUTES.outerFolderPath}${ROUTES.login}`);
        alert('Logout Successful');
    } catch (error) {
        console.error('Error occurred in logout:', error);
    }
};