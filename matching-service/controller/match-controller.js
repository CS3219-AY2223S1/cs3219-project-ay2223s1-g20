import { ormCreateMatch } from "../model/match-orm.js";
import { MatchStatus } from "../utils.js";

export async function matchHandler(req, userID) {
    
    const username = req.username;
    const difficulty = req.difficulty;

    const matchResult = await ormCreateMatch(username, userID, difficulty);

    var resp = {}

    if (matchResult.matchStatus == MatchStatus.MatchSuccess) {
        resp.event = "matchSuccess";
        resp.message = "Match success!"
        resp.matchID = matchResult.matchID;
        resp.myUsername = matchResult.myUsername;
        resp.matchedUsername = matchResult.matchedUsername;
        // add matcheduserid
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

    return resp;
}