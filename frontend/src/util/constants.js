// ---- USER SERVICE ----
export const STATUS_CODE_SUCCESS = 200
export const STATUS_CODE_CREATED = 201
export const STATUS_CODE_CONFLICT = 409
export const STATUS_CODE_UNAUTHORIZED = 401
export const STATUS_CODE_NOT_FOUND = 404

// ---- MATCHING SERVICE ----
export const MATCH_SUCCESS = 'matchSuccess'
export const MATCH_PENDING = 'matchPending'
export const MATCH_FAILED = 'matchFail'
export const CLOSE_ROOM = 'closeRoom'

// ---- CHAT SERVICE ----
export const START_CHAT = 'startChat'
export const CHAT_STARTED = 'chatCreated'
export const SEND_MSG = 'sendMessage'
export const RCV_MSG = 'newMessage'

// ---- LOCAL STORAGE KEYS ----
export const MATCH_ID = 'matchID'

// ---- USER SERVICE BACKEND ERROR MSG ----
export const ERR_INVALID_TOKEN = 'invalid token'
export const ERR_INCORRECT_PASSWORD = 'incorrect password'
export const ERR_UNKNOWN_USERNAME = 'unknown username'
export const ERR_DUP_USERNAME = 'duplicate username'
