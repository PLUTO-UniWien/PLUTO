import JsCookie from 'js-cookie'

function readAuthHeaderFromCookie() {
  const cookieName = 'Authorization'
  return JsCookie.get(cookieName)
}

export function submitResult(result) {
  return fetch(`${process.env.VUE_APP_BACKEND_API_URL}/response`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: readAuthHeaderFromCookie(),
    },
    body: JSON.stringify(result),
  }).then((response) => {
    const result = response.json()
    if (response.ok) {
      return result
    }
    console.error(`Error submitting result: ${JSON.stringify(result)}`)
    return Promise.reject(result)
  })
}
