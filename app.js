import { initializeUserAuth, routeTo } from "./utils/common-utils.js";

const {isLoggedIn} = initializeUserAuth(); 
if (!isLoggedIn) {
    routeTo('./components/login/login.html');
} else {
    routeTo('./components/dashboard/dashboard.html');
}