import { getUserData } from "../services/user-service.js";

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export const validatePassword = (password) => {
    return password.length >= 8;
}

export const isValidUser = (username, password) => {
    const userData = getUserData();
    const user = userData.find(user => user.username === username && user.password === password);
    return !!user;
};