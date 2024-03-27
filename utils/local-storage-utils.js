
/**
 * Set item in local storage
 * @param {*} key 
 * @param {*} value 
 */
export const setItemInLocalStorage = (key, value) => {
    try{
        localStorage.setItem(key, value);
    } catch(error){
        console.log(error.message);
    }
}

/**
 * Get Item from Local Storage
 * @param {*} key 
 * @returns item value
 */
export const getItemFromLocalStorage = (key) => {
    try{
        return localStorage.getItem(key);
    } catch(error){
        console.log(error.message);
        return {};
    }
}

/**
 * Remove item from local storage
 * @param {*} key 
 */
export const removeItemFromLocalStorage = (key) => {
    try{
        localStorage.removeItem(key);
    } catch(error){
        console.log(error.message);
    }
}