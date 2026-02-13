export function infoMsg(hooks, message, duration = 5000) {
  const { state, dispatch } = hooks
  const id = state.id
  dispatch({ type: 'info', payload: { message: message, id: id } })
  setTimeout(() => {
    dispatch({ type: 'clear', payload: { id: id } })
  }, duration)
}
export function errorMsg(hooks, message, duration = 5000) {
  hooks.dispatch({ type: 'error', payload: { message: message, id: 0 } })
  setTimeout(() => {
    hooks.dispatch({ type: 'clear' })
  }, duration)
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
