export function get (URL, bodyJson) {
  const response = fetch(URL, {
    method: 'GET',
    mode: 'cors',
    credentials: 'same-origin',
    headers: {
      // Overwrite Axios's automatically set Content-Type
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': true
    },
    body: bodyJson
  })

  return response
}

export function post (URL, bodyJson) {
  const response = fetch(URL, {
    method: 'POST',
    mode: 'cors',
    credentials: 'same-origin',
    headers: {
      // Overwrite Axios's automatically set Content-Type
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': true
    },
    body: bodyJson
  })

  return response
}

export function put (URL, bodyJson) {
  const response = fetch(URL, {
    method: 'PUT',
    mode: 'cors',
    credentials: 'same-origin',
    headers: {
      // Overwrite Axios's automatically set Content-Type
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': true
    },
    body: bodyJson
  })

  return response
}

export function del (URL, bodyJson) {
  const response = fetch(URL, {
    method: 'DELETE',
    mode: 'cors',
    credentials: 'same-origin',
    headers: {
      // Overwrite Axios's automatically set Content-Type
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': true
    },
    body: bodyJson
  })

  return response
}
