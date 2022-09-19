import Cookies from 'universal-cookie';

const cookies = new Cookies();
const jwtToken = 'jwtToken'
const username = 'username'
const matchID = 'matchID'

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

// matchID
export function setMatchId(value) {
    cookies.set(matchID, value, { path: '/' , maxAge: 24*60*60});
}

export function getMatchId() {
    return cookies.get(matchID);
}

export function removeMatchId() {
    cookies.remove(matchID, { path: '/' });
}

export function hasMatchId() {
    return getMatchId() !== undefined;
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

export function isInRoom() {
    return hasMatchId();
}