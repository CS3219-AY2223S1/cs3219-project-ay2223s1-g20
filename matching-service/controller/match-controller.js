import { ormCreateMatch } from "../model/match-orm.js";

export async function createMatch(req) {
    
    const username1 = req.username1
    const username2 = req.username2
    const difficulty = req.difficulty

    // TODO: implement sth to return a proper resp to socket-cli
    await ormCreateMatch(username1, username2, difficulty);
    return
}