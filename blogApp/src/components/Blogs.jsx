import { useNavigate } from 'react-router-dom'
import BlogList from '../components/BlogList'
import { useAuth, loggedIn } from '../contexts/authContext'

const Blogs = () => {
  const navigate = useNavigate()
  const auth = useAuth()

  return (
    <div>
      <h2>Blogs App</h2>
      <button disabled={!loggedIn(auth)} onClick={() => navigate('/blogs/add')}>
        add blog
      </button>
      <hr></hr>
      <BlogList view="full" />
    </div>
  )
}

export default Blogs
