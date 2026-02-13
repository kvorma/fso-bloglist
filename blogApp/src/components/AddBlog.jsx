import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

import { useMsg } from '../contexts/messageContext'
import { useAuth, loggedIn } from '../contexts/authContext'

import query from '../services/queryServices'
import { infoMsg } from '../services/dispatchServices'

const AddBlog = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const auth = useAuth()
  const msg = useMsg()
  const blogAdd = query.add(useQueryClient())

  const handleSubmit = async (event) => {
    event.preventDefault()
    const args = {
      blogObj: { title, author, url },
      token: auth.state.token,
    }
    blogAdd.mutate(args)
    infoMsg(msg, `a new blog "${title}" has been added`)
    setTitle('')
    setAuthor('')
    setUrl('')
    navigate('/blogs')
  }

  // console.log('AddBlog.render()', auth, loggedIn(auth))

  switch (loggedIn(auth)) {
    case null:
      return <Navigate replace to="/login" state={{ from: location }} />
    case false:
      return <div>Checking login status...</div>
  }
  const allFields = title.length && author.length && url.length
  return (
    <div>
      <h2>Add new blog</h2>
      <form className="addBlog" onSubmit={handleSubmit}>
        <div>
          <label className="addBlogLabel">
            title
            <input
              className="addBlogInput"
              type="text"
              maxLength="100"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
              placeholder="Blog title.."
              autoFocus
            />
          </label>
        </div>
        <div>
          <label className="addBlogLabel">
            author
            <input
              className="addBlogInput"
              type="text"
              maxLength="100"
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
              placeholder="Blog author.."
            />
          </label>
        </div>
        <div>
          <label className="addBlogLabel">
            url
            <input
              className="addBlogInput"
              type="url"
              maxLength="100"
              value={url}
              onChange={({ target }) => setUrl(target.value)}
              placeholder="Blog url.."
            />
          </label>
        </div>

        <button className="addBlogButton" type="submit" disabled={!allFields}>
          submit
        </button>
      </form>
    </div>
  )
}

export default AddBlog
