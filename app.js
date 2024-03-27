import { ROUTES } from "./constants/routes-constants.js";
import { initializeUserAuth, routeTo } from "./utils/common-utils.js";

const {isLoggedIn} = initializeUserAuth(); 
if (!isLoggedIn) {
    routeTo(`${ROUTES.innerFolderPath}components/${ROUTES.login}`);
} else {
    routeTo(`${ROUTES.innerFolderPath}components/${ROUTES.dashboard}`);
}