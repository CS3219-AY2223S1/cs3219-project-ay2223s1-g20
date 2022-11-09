import { get } from './baseApi.js'
import { QUESTION_SVC_PREFIX, QUESTION_BY_ID } from '../util/configs'

export function getQuestionFromQuestionNum (questionNum) {
  const response = get(QUESTION_SVC_PREFIX + QUESTION_BY_ID + questionNum)
  return response
}
