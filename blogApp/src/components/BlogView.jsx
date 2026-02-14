import { useParams, useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../contexts/authContext'
import { useMsg, infoMsg } from '../contexts/messageContext'
import query from '../services/queryServices'

const BlogView = () => {
  const id = useParams().id
  const auth = useAuth()
  const msg = useMsg()
  const navigate = useNavigate()
  const commentRef = useRef()
  const queryClient = useQueryClient()
  const likesAdd = query.likes(queryClient)
  const blogDelete = query.del(queryClient)
  const blogComment = query.comment(queryClient)

  const handleDelete = async () => {
    event.preventDefault()

    if (confirm(`Delete blog "${blog.title}?"`)) {
      const args = {
        blogObj: blog,
        token: auth.state.token,
      }
      blogDelete.mutate(args)
      infoMsg(msg, `blog "${blog.title}" deleted!`)
      navigate('/blogs')
    }
  }

  const handleLike = async () => {
    event.preventDefault()
    const args = {
      blogObj: { ...blog, likes: blog.likes + 1 },
      token: null,
    }
    likesAdd.mutate(args)
    infoMsg(msg, `Thank you for liking "${blog.title}!`)
  }

  const addComment = () => {
    event.preventDefault()
    const args = {
      blogObj: { id: blog.id, comment: commentRef.current.value },
      token: null,
    }
    blogComment.mutate(args)
    infoMsg(msg, `Thank you for adding comment!`)
    commentRef.current.value = ''
  }

  const result = query.all()

  if (result.isLoading) return <div>loading data...</div>
  if (result.isError) return <span>Blogs unavailable: {result.error.message}</span>

  const blog = result.data.find((blog) => blog.id === id)

  let k = 0
  return (
    <div>
      {blogComment.isError && (
        <div className="error">Database error occurred: {blogComment.error.message}</div>
      )}
      {likesAdd.isError && (
        <div className="error">Database error occurred: {likesAdd.error.message}</div>
      )}
      {blogDelete.isError && (
        <div className="error">Database error occurred: {blogDelete.error.message}</div>
      )}
      <h2>
        {blog.title} by {blog.author}
      </h2>
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div>
        {blog.likes} likes{' '}
        <button onClick={() => handleLike()}>like</button>
        {auth?.state?.username === blog.owner.username && (
          <button onClick={() => handleDelete()}>delete</button>
        )}
      </div>
      <div>added by {blog.owner.realname}</div>
      <h3>comments</h3>
      <form onSubmit={addComment}>
        <input
          type="text"
          maxLength="100"
          name="comment"
          ref={commentRef}
          placeholder="add your short comment here"
        />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {blog.comments.map((c) => (
          <li key={k++}>{c}</li>
        ))}
      </ul>
    </div>
  )
}

export default BlogView
