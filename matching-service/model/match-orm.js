import { MatchStatus } from "../utils.js";
import { checkIsMatched, createMatch, createPendingMatch, findPendingMatch, removePendingMatch, checkIsPending, removeMatch, findMatchFromUserID } from "./repository.js";

export async function ormCreateMatch(username, userID, difficulty) {
    var matchResult = {}

    // check if user has already being matched
    const isUserMatched = await checkIsMatched(username);
    console.log("[ormCreateMatch] isUserMatched=", isUserMatched)
    if (isUserMatched == true) {
        matchResult.matchStatus = MatchStatus.MatchExists;
        console.log("[ormCreateMatch] Match exists for username=", username)
        return matchResult;
    }

    // check if user is already waiting to be matched
    const isUserPending = await checkIsPending(username); // implement
    if (isUserPending == true) {
        matchResult.matchStatus = MatchStatus.MatchPending;
        console.log("[ormCreateMatch] PendingMatch exists for username=", username)
        return matchResult
    }

    // find a suitable match from pending, if none, create your own pending entry
    const matchedUser = await findPendingMatch(difficulty);
    if (matchedUser == null) {
        console.log("[ormCreateMatch] No suitable matches found, adding user to PendingMatch, username=", username)
        await ormCreatePendingMatch(userID, username, difficulty);
        matchResult.matchStatus = MatchStatus.MatchPending;
        matchResult.userID = userID;
        matchResult.username = username;
        matchResult.difficulty = difficulty;
        return matchResult;
    } else {
        console.log("[ormCreateMatch] Suitable match found, matchedUser=", matchedUser)
        const match = await createMatch(username, matchedUser.username, userID, matchedUser.userID, difficulty);
        console.log('[ormCreateMatch] New Match created: ', match);
        await removePendingMatch(matchedUser.userID);
        matchResult.matchStatus = MatchStatus.MatchSuccess;
        matchResult.matchID = match.matchID;
        matchResult.username = username;
        matchResult.matchedUsername = matchedUser.username;
        matchResult.userID = userID;
        matchResult.matchedUserID = matchedUser.userID;
        matchResult.difficulty = difficulty;
        return matchResult;
    }
}

export async function ormCreatePendingMatch(userID, username, difficulty) {
    const pendingMatch = await createPendingMatch(userID, username, difficulty);
    console.log('[ormCreateMatch] New PendingMatch created: ', pendingMatch);
    return pendingMatch;
}

export async function ormRemovePendingMatch(userID) {
    removePendingMatch(userID).catch((err) => (console.log(err)));
    return;
}

export async function ormCloseMatch(userID) {
    const match = await findMatchFromUserID(userID);
    if (match != null) {
        await removeMatch(res.matchID);
    }
    return;
}
