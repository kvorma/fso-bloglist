import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { serviceLogin } from '../services/loginServices'
import { useAuth, setLogin } from '../contexts/authContext'
import { useMsg, infoMsg, errorMsg } from '../contexts/messageContext'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const auth = useAuth()
  const msg = useMsg()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await serviceLogin(username, password)
      setLogin(auth, user)
      infoMsg(msg, `Logging in ${user.realname}!`)
      setUsername('')
      setPassword('')
      navigate(location.state?.from || '/')
    } catch (error) {
      errorMsg(msg, error.message)
    }
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              className="login"
              type="text"
              maxLength="100"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
              autoFocus
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              className="login"
              type="password"
              value={password}
              maxLength="100"
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit" disabled={username.length === 0}>
          login
        </button>
      </form>
    </div>
  )
}

export default Login
