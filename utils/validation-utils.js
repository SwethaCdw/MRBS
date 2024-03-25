import { getUserData } from "../services/user-service.js";
/**
 * Check if the email matches its expression
 * @param {*} email 
 * @returns true/false
 */
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Check if password length is greater than 8
 * @param {*} password 
 * @returns true/false
 */
export const validatePassword = (password) => {
    return password.length >= 8;
}

/**
 * Check if the given username and password matches the data
 * @param {*} username 
 * @param {*} password 
 * @returns trie/false
 */
export const isValidUser = (username, password) => {
    const userData = getUserData();
    const user = userData.find(user => user.username === username && user.password === password);
    return !!user;
};