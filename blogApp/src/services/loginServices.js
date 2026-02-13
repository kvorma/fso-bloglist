import config from '../config'

export async function serviceLogin(username, password) {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  }

  const resp = await fetch(config.loginUrl, options)
  if (!resp.ok) {
    if (resp.status === 401) {
      throw new Error('Incorrect username or password!')
    } else {
      throw new Error(`Login services failed: ${resp.statusText} (${resp.status})`)
    }
  }

  const data = await resp.json()
  return data
}
