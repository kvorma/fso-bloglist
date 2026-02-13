import { useState } from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'

import { useMsg, infoMsg } from '../contexts/messageContext'
import { useAuth } from '../contexts/authContext'

import db from '../services/dbServices'

const ShowBlog = ({ blog }) => {
  const [viewButton, setViewButton] = useState('view')
  const user = useAuth().state
  const msg = useMsg()
  const queryClient = useQueryClient()

  const delMutation = useMutation({
    mutationFn: db.del,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
    onError: (error) => {
      console.error('onError', error)
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  const likesMutation = useMutation({
    mutationFn: db.updateLikes,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  const toggleInfo = () => setViewButton(viewButton === 'view' ? 'hide' : 'view')

  const handleDelete = async () => {
    event.preventDefault()

    if (confirm(`Delete blog "${blog.title}?"`)) {
      const args = {
        blogObj: blog,
        token: user.token,
      }
      delMutation.mutate(args)
      infoMsg(msg, `blog "${blog.title}" deleted!`)
    }
  }

  const handleLike = async () => {
    event.preventDefault()
    const args = {
      blogObj: { ...blog, likes: blog.likes + 1 },
      token: user.token,
    }
    likesMutation.mutate(args)
    infoMsg(msg, `Thank you for liking "${blog.title}!`)
  }

  return (
    <div className="blogstyle">
      {blog.title} - {blog.author}
      <button onClick={toggleInfo}>{viewButton}</button>
      {user?.username === blog.owner.username && (
        <button onClick={() => handleDelete()}>delete</button>
      )}
      {viewButton === 'hide' && (
        <div>
          <div>url: {blog.url}</div>
          <div>
            likes: {blog.likes}
            {user && <button onClick={() => handleLike()}>like</button>}
          </div>
          <div>added: {blog.owner.realname}</div>
        </div>
      )}
    </div>
  )
}
export default ShowBlog
