import { useContext, createContext, useReducer } from 'react'
export const MsgContext = createContext(null)
export const MsgDispatchContext = createContext(null)

export function MsgProvider({ children }) {
  const [msg, dispatch] = useReducer(msgReducer, initialState)

  return (
    <MsgContext value={msg}>
      <MsgDispatchContext value={dispatch}>{children}</MsgDispatchContext>
    </MsgContext>
  )
}

export function useMsg() {
  return { state: useContext(MsgContext), dispatch: useContext(MsgDispatchContext) }
}

export function errorMsg(hooks, message, duration = 5000) {
  const { state, dispatch } = hooks
  const id = state.id
  dispatch({ type: 'error', payload: { message: message, id: id } })
  setTimeout(() => {
    dispatch({ type: 'clear', payload: { id: id } })
  }, duration)
}

export function infoMsg(hooks, message, duration = 5000) {
  const { state, dispatch } = hooks
  const id = state.id
  dispatch({ type: 'info', payload: { message: message, id: id } })
  setTimeout(() => {
    dispatch({ type: 'clear', payload: { id: id } })
  }, duration)
}

const initialState = {
  message: '',
  severity: 'clear',
  // duration: 0,
  id: 0,
}

// payload: { message, id }

function msgReducer(state, action) {
  switch (action.type) {
    case 'info':
    case 'error': {
      const newState = {
        message: action.payload.message,
        severity: action.type,
        id: state.id + 1,
      }
      return newState
    }
    case 'clear': {
      const id = action.payload.id
      // console.log(id === state.id - 1 ? 'clear' : 'ignore', id, state.id)
      return id === state.id - 1 ? { ...initialState, id: id } : state
    }
  }
}
