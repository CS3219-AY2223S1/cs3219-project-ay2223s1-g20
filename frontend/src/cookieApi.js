import Cookies from 'universal-cookie';
const cookies = new Cookies();
const jwtToken = 'jwtToken'

export function setJwtToken(value) {
    cookies.set(jwtToken, value, { path: '/' });
    console.log("jwtToken set")
    console.log("test retrieval: ")
    console.log(cookies.get(jwtToken));
}

export function getJwtToken() {
    return cookies.get(jwtToken);
}