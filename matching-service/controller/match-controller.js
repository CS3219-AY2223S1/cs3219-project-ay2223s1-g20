import { ormCloseMatch, ormCreateMatch, ormRemovePendingMatch } from "../model/match-orm.js";
import { MatchStatus } from "../utils.js";

export async function matchHandler(req, userID) {

    const username = req.username;
    const difficulty = req.difficulty;

    console.log("[matchHandler] Match request received for ", username, difficulty)

    const matchResult = await ormCreateMatch(username, userID, difficulty);
    console.log("[matchHandler] matchResult=", matchResult)

    var resp = {}

    if (matchResult.matchStatus == MatchStatus.MatchSuccess) {
        resp.event = "matchSuccess";
        resp.message = "Match success!"
        resp.matchID = matchResult.matchID;
        resp.username = matchResult.username;
        resp.matchedUsername = matchResult.matchedUsername;
        resp.userID = matchResult.userID
        resp.matchedUserID = matchResult.matchedUserID
        resp.difficulty = matchResult.difficulty
    } else if (matchResult.matchStatus == MatchStatus.MatchPending) {
        resp.event = "matchPending";
        resp.message = "No match available at the moment, waiting for available match now."
    } else if (matchResult.matchStatus == MatchStatus.MatchExists) {
        resp.event = "matchFail";
        resp.message = "You are currently in another match, please exit that match and try again."
    } else {
        resp.event = "matchFail";
        resp.message = "Matching failed."
    }

    console.log("[matchHandler] Match request handled, resp=", resp)
    return resp;
}

export async function closeMatchHandler(userID, roomIDs) {
    // close all related rooms. by right there should only be one roomID per user
    for (roomID in roomIDs) {
        if (roomID != userID) { // by default under socketio, a user joins a room with roomID=socketID
            await ormCloseMatch(roomIDs);
        }
    }
    
    // close all related pendingmatches if there is
    await ormRemovePendingMatch(userID);

    return;
}