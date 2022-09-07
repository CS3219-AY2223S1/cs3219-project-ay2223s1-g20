export function genMatchId(userID1, userID2, difficulty) {
    return "MatchID_" + userID1 + "_" + userID2 + "_" + difficulty;
}

export const MatchStatus = {
    MatchSuccess: 0,
    MatchFailed: 1,
    MatchExists: 2,
    MatchPending: 3,
}