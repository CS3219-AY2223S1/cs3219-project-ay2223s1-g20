export function post(URL, bodyJson) {
    const response = fetch(URL, {
        method: 'POST',
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
          // Overwrite Axios's automatically set Content-Type
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': true,
        },
        body: bodyJson
    })

    return response;
}