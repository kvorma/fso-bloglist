import { useState } from 'react'

import query from '../services/queryServices'

const BlogList = ({ view }) => {
  const original = 'original order',
    byLikes = 'order by likes'
  const [sortButton, setSortButton] = useState(byLikes)
  const handleSort = () => {
    setSortButton(sortButton === original ? byLikes : original)
  }

  const result = query.all()

  if (result.isLoading) return <div>loading data...</div>
  if (result.isError)
    return <div className="error">Blogs unavailable: {result.error.message}</div>

  const blogs =
    sortButton === original ? result.data.toSorted((a, b) => b.likes - a.likes) : result.data
  const shown = view === 'full' ? blogs : blogs.splice(-5)

  return (
    <ul>
      {shown.map((blog) => (
        <li key={blog.id}>
          <a href={'/blogs/' + blog.id}>{blog.title}</a>
          <em> by {blog.author}</em>
        </li>
      ))}
      {view === 'full' && <button onClick={handleSort}>{sortButton}</button>}
    </ul>
  )
}

export default BlogList
