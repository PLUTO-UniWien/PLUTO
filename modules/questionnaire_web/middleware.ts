// @ts-ignore
import { next } from '@vercel/edge'

export const config = {
  matcher: '/',
}

/**
 * @type {Response}
 */
const UNAUTHORIZED_RESPONSE = new Response('Unauthorized', {
  status: 401,
  headers: {
    'WWW-Authenticate':
      'Basic realm="Access to the staging site", charset="UTF-8"',
  },
})

function getAllowedCredentials() {
  // Format: username1:password1|username2:password2...
  const authConfig = process.env.BASIC_AUTH_CREDENTIALS
  const credentials = authConfig.split('|')
  return credentials.map((credential) => {
    const [username, password] = credential.split(':')
    return { username, password }
  })
}
export default function middleware(request: Request) {
  const allowedCredentials = getAllowedCredentials()
  const auth = request.headers.get('Authorization')
  if (!auth) return UNAUTHORIZED_RESPONSE
  const [username, password] = atob(auth.split(' ')[1]).split(':')
  const isAuthorized = allowedCredentials.some((credential) => {
    return credential.username === username && credential.password === password
  })
  if (!isAuthorized) return UNAUTHORIZED_RESPONSE
  // If authorized, return the request and store the Authorization header as a cookie
  const response = next(request)
  response.headers.set('Set-Cookie', `Authorization=${auth}`)
  return response
}
