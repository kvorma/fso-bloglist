import { Link } from 'react-router-dom'

import { useAuth } from '../contexts/authContext'

import Logout from '../components/Logout'

const Navbar = ({ items }) => {
  const auth = useAuth()

  return (
    <div className="navBar">
      {items.map((i) => (
        <Link key={i.title} className="navBarLink" to={i.url}>
          {i.title}
        </Link>
      ))}
      {auth.state !== null ? (
        <em> {auth.state.realname} logged in </em>
      ) : (
        <Link className="navBarLogin" to="/login">
          login
        </Link>
      )}
      <Logout />
    </div>
  )
}

export default Navbar
