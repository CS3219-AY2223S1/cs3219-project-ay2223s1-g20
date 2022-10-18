import { get } from './baseApi.js'
import { QUESTION_SVC_PREFIX, QUESTION_BY_ID } from '../util/configs'

export function getQuestionFromQuestionNum (questionNum) {
  // questionNum = 'Hy8hM5057Bq4IIXvV0Ul'
  const response = get(QUESTION_SVC_PREFIX + QUESTION_BY_ID + questionNum)
  return response
}
