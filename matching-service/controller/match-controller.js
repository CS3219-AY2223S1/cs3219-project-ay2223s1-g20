import { ormCheckIsMatchAvailable, ormCheckMatchStatus, ormCreateMatch } from "../model/match-orm.js";
import { createPendingMatch } from "../model/repository.js";
import { MatchStatus } from "../utils.js";

export async function matchHandler(req, userID) {
    
    const username = req.username;
    const difficulty = req.difficulty;

    const isUserMatched = ormCheckMatchStatus(username);
    if (isUserMatched == MatchStatus.MatchExists) {
        const matchResult = {
            matchStatus: MatchStatus.MatchExists
        }
        return matchResult;
    }

    const isMatchAvailable = ormCheckIsMatchAvailable(difficulty)
    if (isMatchAvailable == false) {
        const pendingMatch = createPendingMatch(userID, username, difficulty);
        const matchResult = {
            matchStatus: MatchStatus.MatchPending,
            userID: pendingMatch.userID,
            username: pendingMatch.username,
            difficulty: pendingMatch.difficulty
        }
        return matchResult;
    }

    const matchInfo = ormCreateMatch(userID, username, difficulty);
    const matchResult = {
        matchStatus: MatchStatus.MatchSuccess,
        matchID: matchInfo.matchID,
        matchedUserID: matchInfo.matchedUserID,
        matchedUserName: matchInfo.matchedUsername
    }

    return matchResult;
}