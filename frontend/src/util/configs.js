export const USER_SVC_PREFIX = process.env.REACT_APP_ENV === 'PROD' ? process.env.REACT_APP_URI_USER_SVC : '/user'
export const URI_USER_SVC = process.env.REACT_APP_URI_USER_SVC || 'http://localhost:8000'

export const MATCHING_SVC_PREFIX = process.env.REACT_APP_ENV === 'PROD' ? process.env.REACT_APP_URI_MATCHING_SVC : '/matching'
export const URI_MATCHING_SVC = process.env.REACT_APP_URI_MATCHING_SVC || 'http://localhost:8001'

export const COLLAB_SVC_PREFIX = process.env.REACT_APP_ENV === 'PROD' ? process.env.REACT_APP_URI_COLLAB_SVC : '/collab'
export const URI_COLLAB_SVC = process.env.REACT_APP_URI_COLLAB_SVC || 'http://localhost:8002'

export const QUESTION_SVC_PREFIX = process.env.REACT_APP_ENV === 'PROD' ? process.env.REACT_APP_URI_QUESTION_SVC : '/question'
export const URI_QUESTION_SVC = process.env.REACT_APP_URI_QUESTION_SVC || 'http://localhost:8003'

export const CHAT_SVC_PREFIX = process.env.REACT_APP_ENV === 'PROD' ? process.env.REACT_APP_URI_CHAT_SVC : '/chat'
export const URI_CHAT_SVC = process.env.REACT_APP_URI_CHAT_SVC || 'http://localhost:8004'

export const HISTORY_SVC_PREFIX = process.env.REACT_APP_ENV === 'PROD' ? process.env.REACT_APP_URI_HISTORY_SVC :'/history'
export const URI_HISTORY_SVC = process.env.REACT_APP_URI_HISTORY_SVC || 'http://localhost:8005'

export const REGISTER = '/accounts'
export const LOG_IN = '/login'
export const LOG_OUT = '/logout'
export const ACCOUNTS = '/accounts/'

export const QUESTION_BY_ID = '/question/id/'
