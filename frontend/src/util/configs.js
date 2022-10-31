console.log(process.env.ENV)
console.log(process.env.URI_USER_SVC)
console.log(process.env.URI_MATCHING_SVC)
console.log(process.env.URI_COLLAB_SVC)
console.log(process.env.URI_QUESTION_SVC)

export const USER_SVC_PREFIX = process.env.ENV === 'PROD' ? process.env.URI_USER_SVC : '/user'
export const URI_USER_SVC = process.env.URI_USER_SVC || 'http://localhost:8000'

export const MATCHING_SVC_PREFIX = process.env.ENV === 'PROD' ? process.env.URI_MATCHING_SVC : '/matching'
export const URI_MATCHING_SVC = process.env.URI_MATCHING_SVC || 'http://localhost:8001'

export const COLLAB_SVC_PREFIX = process.env.ENV === 'PROD' ? process.env.URI_COLLAB_SVC : '/collab'
export const URI_COLLAB_SVC = process.env.URI_COLLAB_SVC || 'http://localhost:8002'

export const QUESTION_SVC_PREFIX = process.env.ENV === 'PROD' ? process.env.URI_QUESTION_SVC : '/question'
export const URI_QUESTION_SVC = process.env.URI_QUESTION_SVC || 'http://localhost:8003'

export const REGISTER = '/accounts'
export const LOG_IN = '/login'
export const LOG_OUT = '/logout'
export const ACCOUNTS = '/accounts/'

export const QUESTION_BY_ID = '/question/id/'
