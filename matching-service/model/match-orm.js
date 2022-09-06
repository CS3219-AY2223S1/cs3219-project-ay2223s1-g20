import { MatchStatus } from "../utils.js";
import { checkIsMatched, createMatch, createPendingMatch, findPendingMatch, removePendingMatch } from "./repository.js";

export async function ormCreateMatch(username, userID, difficulty) {
    var matchResult = {}

    // check if user has already being matched
    const isUserMatched = await checkIsMatched(username);
    if (isUserMatched == true) {
        matchResult.matchStatus = MatchStatus.MatchExists;
        return matchResult;
    }

    // check if user is already waiting to be matched
    const isUserPending = await checkIsPending(username); // implement
    if (isUserPending == true) {
        matchResult.matchStatus = MatchStatus.MatchPending;
        return matchResult
    }

    // find a suitable match from pending, if none, create your own pending entry
    const matchedUser = findPendingMatch(difficulty);
    if (matchedUser == null) {
        await ormCreatePendingMatch(userID, username, difficulty);
        matchResult.matchStatus = MatchStatus.MatchPending;
        matchResult.userID = userID;
        matchResult.username = username;
        matchResult.difficulty = difficulty;
        return matchResult;
    } else {
        const match = await createMatch(username, matchedUser.username, difficulty);
        console.log('New Match created: ', match);
        await removePendingMatch(matchedUser.username);
        matchResult.matchStatus = MatchStatus.MatchSuccess;
        matchResult.matchID = match.matchID;
        matchResult.myUsername1 = username;
        matchResult.matchedUsername = matchedUser.username;
        matchResult.myUserID = userID;
        matchResult.matchedUserID = matchedUser.userID;
        matchResult.difficulty = difficulty;
        return matchResult;
    }
}

export async function ormCreatePendingMatch(userID, username, difficulty) {
    const pendingMatch = await createPendingMatch(userID, username, difficulty);
    console.log('New PendingMatch created: ', pendingMatch);
    return pendingMatch;
}
