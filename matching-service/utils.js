export function genMatchId(username1, username2, difficulty) {
    return "RoomID_" + username1 + "_" + username2 + "_" + difficulty;
}

export const MatchStatus = {
    MatchSuccess: 0,
    MatchFailed: 1,
    MatchExists: 2,
    MatchPending: 3
}