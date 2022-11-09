import { get, post } from './baseApi.js'
import { HISTORY_SVC_PREFIX } from '../util/configs'

export function testHistoryConnection () {
  const response = get(HISTORY_SVC_PREFIX + '/')
  return response
}

export function getHistoryFromUsername (username) {
  const response = get(HISTORY_SVC_PREFIX + '/history/' + username)
  return response
}

export function postQuestionIdByUsername (username, questionId) {
  console.log(HISTORY_SVC_PREFIX + '/history')
  post(HISTORY_SVC_PREFIX + '/history', JSON.stringify({ username, questionId }))
}
