import { createMatch } from "./repository.js";

export async function ormCreateMatch(username1, username2, difficulty) {
    try {
        const newMatch = await createMatch(username1, username2, difficulty);
        console.log('New Match created: ', newMatch);
        return true;
    } catch (err) {
        console.log('ERROR: Could not create new Match, ', err);
        return false;
    }
}