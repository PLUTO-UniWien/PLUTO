export function submitResult(result) {
  return fetch(`${process.env.VUE_APP_BACKEND_API_URL}/response`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(result),
  }).then((response) => {
    return response.json()
  })
}
