import { useAuth, loggedIn } from '../contexts/authContext'
import BlogList from '../components/BlogList'

const Home = () => {
  const auth = useAuth()

  return (
    <div>
      <h1>Full Stack Open course 2025 -- exercise 7.21</h1>
      <hr></hr>
      {!loggedIn(auth) && (
        <div>
          <a href="/login">Please login to have full functionality</a>
        </div>
      )}
      <h2>Latest blogs</h2>
      <BlogList view="home" />
      <h3>
        <a href="/blogs">see all blogs</a>
      </h3>
    </div>
  )
}

export default Home
