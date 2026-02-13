import { useContext, createContext, useReducer } from 'react'
import config from '../config'

export const AuthContext = createContext(null)
export const AuthDispatchContext = createContext(null)

export function AuthProvider({ children }) {
  const [auth, dispatch] = useReducer(authReducer, { loggedIn: false })

  return (
    <AuthContext value={auth}>
      <AuthDispatchContext value={dispatch}>{children}</AuthDispatchContext>
    </AuthContext>
  )
}

export function useAuth() {
  const state = useContext(AuthContext)
  const dispatch = useContext(AuthDispatchContext)

  return { state, dispatch }
}

export function setLogin(auth, payload) {
  auth.dispatch({ type: 'login', payload: payload })
}

export function setLogout(auth) {
  auth.dispatch({ type: 'logout' })
}

export function setSession(auth) {
  auth.dispatch({ type: 'session' })
}

export function authPending(auth) {
  auth.dispatch({ type: 'pending' })
}

export function loggedIn(auth) {
  return auth?.state?.loggedIn
}

function validateAuthObject(candidate) {
  const template = {
    username: 'jdoe',
    realname: 'John Doe',
    token: 'na',
  }

  if (Object.keys(template).every((e) => typeof template[e] === typeof candidate[e])) {
    return true
  }
  throw new TypeError('data validation error')
}

// state: { username, realname, token, loggedIn }
// action { type, payload }
// loggedIn: true = authorized, false = pending - login in progress, null = logged out

function authReducer(state, action) {
  // console.log('reducer', state, action)
  switch (action.type) {
    case 'login':
      try {
        validateAuthObject(action.payload)
        window.localStorage.setItem(config.loggedTag, JSON.stringify(action.payload))
      } catch (error) {
        console.error('Cannot save auth to local storage:', error)
      }
      return { ...action.payload, loggedIn: true }

    case 'logout':
      window.localStorage.removeItem(config.loggedTag)
      return null

    case 'pending':
      return { ...state, loggedIn: false }

    case 'session':
      let logged = ''
      try {
        logged = window.localStorage.getItem(config.loggedTag)
      } catch (error) {
        console.error('Cannot restore auth from local storage:', error)
        return null
      }
      if (logged) {
        try {
          const auth = JSON.parse(logged)
          validateAuthObject(auth)
          console.log(`Found credentials for <${auth.username}> from local storage..`)
          return { ...auth, loggedIn: true }
        } catch (error) {
          console.error('session data corrupted - removing', error)
          window.localStorage.removeItem(config.loggedTag)
        }
      }
      return null
    default:
      return null
  }
}
