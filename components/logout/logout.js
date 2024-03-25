import { LOCAL_STORAGE_KEYS } from "../../constants/common-constants.js";
import { ROUTES } from "../../constants/routes-constants.js";
import { initializeUserAuth, routeTo } from "../../utils/common-utils.js"
import { removeItemFromLocalStorage } from "../../utils/local-storage-utils.js";


export const logout = () => {
    let { isLoggedIn } = initializeUserAuth();
    isLoggedIn = false;
    removeItemFromLocalStorage(LOCAL_STORAGE_KEYS.IS_LOGGED_IN);
    removeItemFromLocalStorage(LOCAL_STORAGE_KEYS.USERNAME);
    routeTo(ROUTES.login);
    alert('Logout Successful');
};
