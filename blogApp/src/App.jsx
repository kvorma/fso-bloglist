// Full Stack Open harjoitustyö
// Applikaation runko

import { useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'

import { useAuth, setSession } from './contexts/authContext'

import Home from './components/Home'
import Users from './components/Users'
import UserView from './components/UserView'
import Blogs from './components/Blogs'
import BlogView from './components/BlogView'
import AddBlog from './components/AddBlog'
import Login from './components/Login'
import Notification from './components/Notification'
import Footer from './components/Footer'
import Navbar from './components/Navbar'

const NotFound = () => {
  const navigate = useNavigate()
  return (
    <div>
      <h1>404: Page not found</h1>
      <button onClick={() => navigate('/')}>Go to Home Page</button>
    </div>
  )
}

const navbarItems = [
  { title: 'home', url: '/', element: 'Home' },
  { title: 'blogs', url: '/blogs', element: 'Blogs' },
  { title: 'users', url: '/users', element: 'Users' },
]

const App = () => {
  const auth = useAuth()

  useEffect(() => {
    setSession(auth)
  }, [])

  //console.log('App.render()', auth)

  return (
    <div className="container">
      <Navbar items={navbarItems} />
      <Routes>
        <Route path="/users/:id" element={<UserView />} />
        <Route path="/users" element={<Users />} />
        <Route path="/blogs/:id" element={<BlogView />} />
        <Route path="/blogs/add" element={<AddBlog />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/login" element={<Login />} />
        <Route exact path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Notification />
      <hr></hr>
      <Footer />
    </div>
  )
}

export default App
