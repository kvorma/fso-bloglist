import query from '../services/queryServices'

const Users = () => {
  const stats = {}
  const allBlogs = query.all()

  if (allBlogs.isPending) {
    return (
      <div>
        <h2>Users</h2>
        <p>Loading...</p>
      </div>
    )
  }
  if (allBlogs.error) {
    return (
      <div>
        <h2>Users</h2>
        <div className="error">Blogs unavailable: {allBlogs.error.message}</div>
      </div>
    )
  }
  if (allBlogs?.data.length) {
    for (const blog of allBlogs.data) {
      if (stats[blog.owner?.realname] === undefined) {
        stats[blog.owner.realname] = {
          realname: blog.owner.realname,
          count: 1,
          id: blog.owner.id,
          blogs: [],
        }
      } else {
        stats[blog.owner.realname].count++
        stats[blog.owner.realname].blogs.push(blog.title)
      }
    }
  }
  let key = 0
  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>Blog added by</th>
            <th>count</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(stats).map((i) => (
            <tr key={key++}>
              <td>
                <a href={'/users/' + stats[i].id}>{i}</a>
              </td>
              <td>{stats[i].count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users
