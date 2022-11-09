export function genMatchId(userID1, userID2, difficulty) {
    return "MatchID_" + userID1 + "_" + userID2 + "_" + difficulty;
}

export function getOtherUser(currentUserID, userID1, userID2) {
    if (userID1 == currentUserID) {
        return userID2;
    } else {
        return userID1;
    }
}

export const MatchStatus = {
    MatchSuccess: 0,
    MatchFailed: 1,
    MatchExists: 2,
    MatchPending: 3,
}