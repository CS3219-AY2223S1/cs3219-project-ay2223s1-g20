import Cookies from 'universal-cookie';
const cookies = new Cookies();
const jwtToken = 'jwtToken'
const username = 'username'

// JWT TOKEN
export function setJwtToken(value) {
    cookies.set(jwtToken, value, { path: '/' });
}

export function getJwtToken() {
    return cookies.get(jwtToken);
}

export function removeJwtToken() {
    cookies.remove(jwtToken, { path: '/' });
}


// USERNAME
export function setUsername(value) {
    cookies.set(username, value, { path: '/' });
}

export function getUsername() {
    return cookies.get(username);
}

export function removeUsername() {
    cookies.remove(username, { path: '/' });
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