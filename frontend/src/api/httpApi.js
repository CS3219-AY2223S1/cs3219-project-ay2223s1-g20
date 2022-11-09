// Prototype for frontend

import { QUESTION_BY_ID, QUESTION_SVC_PREFIX } from '../util/configs'

// fetch to access API in question service
export function getQuestionFromQuestionService (req) {
  const url = QUESTION_SVC_PREFIX + QUESTION_BY_ID + req.params.id

  return fetch(url, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  }).then(res => res.json())
    .then((response) => {
      console.log('fetch from question service')
      console.log(response)
      return response
    }).catch((error) => {
      throw new Error('Unable to retrieve question')
    })
}
