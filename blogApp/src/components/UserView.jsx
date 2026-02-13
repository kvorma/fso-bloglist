import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import db from '../services/dbServices'

const UserView = ({ stats }) => {
  const id = useParams().id

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: db.getAll,
    retry: 1,
  })

  if (result.isLoading) return <div>loading data...</div>
  if (result.isError) return <span>Blogs unavailable: {result.error.message}</span>

  const username = result.data.find((blog) => blog.owner.id === id).owner.realname

  return (
    <div>
      <h2>{username}</h2>
      <h3>added the following blogs</h3>
      <ul>
        {result.data.map(
          (blog) =>
            blog.owner.id === id && (
              <li key={blog.id}>
                <a href={'/blogs/' + blog.id}>{blog.title}</a>
              </li>
            )
        )}
      </ul>
    </div>
  )
}

export default UserView
