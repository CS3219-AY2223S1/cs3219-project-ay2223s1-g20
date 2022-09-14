import Cookies from 'universal-cookie';

const cookies = new Cookies();
const jwtToken = 'jwtToken'
const username = 'username'

// JWT TOKEN
export function setJwtToken(value) {
    cookies.set(jwtToken, value, { path: '/' , maxAge: 24*60*60});
}

export function getJwtToken() {
    return cookies.get(jwtToken);
}

export function removeJwtToken() {
    cookies.remove(jwtToken, { path: '/' });
}

export function hasJwtToken() {
    return getJwtToken() !== undefined;
}

// USERNAME
export function setUsername(value) {
    cookies.set(username, value, { path: '/' , maxAge: 24*60*60});
}

export function getUsername() {
    return cookies.get(username);
}

export function removeUsername() {
    cookies.remove(username, { path: '/' });
}

export function hasUsername() {
    return getUsername() !== undefined;
}

// GENERAL FUNCTIONS
export function setJwtAndUsernameCookie(token, username) {
    setJwtToken(token);
    setUsername(username);
}

export function removeJwtAndUsernameCookie() {
    removeJwtToken();
    removeUsername();
}

export function isAuthenticated() {
    return hasUsername() && hasJwtToken();
}