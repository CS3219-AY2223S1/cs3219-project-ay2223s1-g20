import { MatchStatus } from "../utils.js";
import { checkIsMatchAvailable, checkIsMatched, createMatch, createPendingMatch, findPendingMatch, removePendingMatch } from "./repository.js";

export async function ormCreateMatch(username, difficulty) {

    // now we found a potential match user, what to do?
    // -> check if this match exists
    // -> remove this pending match
    // -> create a new match
    // --> add db entry of this new match
    // --> add both ID into the same room on socketIO
    // --> emit matchSuccess for both fella

    try {
        const matchedUser = findPendingMatch(difficulty);
        const match = await createMatch(username, matchedUser.username, difficulty);
        console.log('New Match created: ', match);

        removePendingMatch(matchedUser.username)

        const matchInfo = {
            matchID: match.matchID,
            matchedUsername: matchedUser.username,
            matchedUserID: matchedUser.userID
        }

        return matchInfo;
    } catch (err) {
        console.log('ERROR: Could not create new Match, ', err);
        return {};
    }
}

export async function ormCreatePendingMatch(userID, username, difficulty) {
    const matchedUser = findPendingMatch(difficulty);
    const pendingMatch = createPendingMatch(userID, username, difficulty);
    return pendingMatch;
}

export async function ormCheckMatchStatus(username) {
    const isUserMatched = await checkIsMatched(username);
    if (isUserMatched == true) {
        // request invalid, user has already being matched
        return MatchStatus.MatchExists;
    }
}

export async function ormCheckIsMatchAvailable(difficulty) {
    const isMatchAvailable = await checkIsMatchAvailable(difficulty);
    return isMatchAvailable;
}