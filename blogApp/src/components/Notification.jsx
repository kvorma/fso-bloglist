// display notification or error message

import { useMsg } from '../contexts/messageContext'

const Notification = () => {
  const { state, dispatch } = useMsg()

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10,
    color: state.severity === 'error' ? 'red' : 'black',
  }

  return state.severity === 'clear' ? null : (
    <div className={state.severity}>{state.message}</div>
  )
}

export default Notification
