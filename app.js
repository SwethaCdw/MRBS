import { ROUTES } from "./constants/routes-constants.js";
import { initializeUserAuth } from "./utils/common-utils.js";

const {isLoggedIn} = initializeUserAuth(); 
console.log(isLoggedIn);
if (!isLoggedIn) {
    window.location.href = './components/login/login.html';
} else {
    window.location.href = './components/dashboard/dashboard.html';
}