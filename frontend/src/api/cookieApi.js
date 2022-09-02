import Cookies from 'universal-cookie';
const cookies = new Cookies();
const jwtToken = 'jwtToken'

export function setJwtToken(value) {
    cookies.set(jwtToken, value, { path: '/' });
}

export function getJwtToken() {
    return cookies.get(jwtToken);
}

export function removeJwtToken() {
    cookies.remove(jwtToken, { path: '/' });
}