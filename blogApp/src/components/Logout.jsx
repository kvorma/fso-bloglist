import { useNavigate } from 'react-router-dom'

import { useAuth, setLogout } from '../contexts/authContext'
import { useMsg, infoMsg } from '../contexts/messageContext'

const Logout = () => {
  const msg = useMsg()
  const auth = useAuth()
  const navigate = useNavigate()

  const handleLogout = (event) => {
    event.preventDefault()
    infoMsg(msg, 'logged out ' + auth.state.realname)
    setLogout(auth)
    navigate('/')
  }
  if (auth.state === null) return null

  return (
    <>
      <button className="logout" onClick={handleLogout}>
        logout
      </button>
    </>
  )
}

export default Logout
