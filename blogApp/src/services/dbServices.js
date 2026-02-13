import config from '../config'

const toBearer = (token) => 'Bearer ' + token

const getAll = async () => {
  const response = await fetch(config.blogUrl)
  if (!response.ok) {
    throw new Error(`fetching blogs: ${response.statusText}`)
  }
  return response.json()
}

const add = async ({ blogObj, token }) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: toBearer(token) },
    body: JSON.stringify(blogObj),
  }

  const response = await fetch(config.blogUrl, options)

  if (!response.ok) {
    if (response.status === 400) {
      const e = await response.json()
      throw new TypeError(e.error)
    } else {
      throw new Error(`adding comments: ${response.statusText}`)
    }
  }
  return response.json()
}

const updateLikes = async ({ blogObj }) => {
  const options = {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ likes: blogObj.likes }),
  }

  const response = await fetch(`${config.blogUrl}/${blogObj.id}`, options)

  if (!response.ok) {
    throw new Error(`updating "likes": ${response.statusText}`)
  }

  return response.json()
}

const addComment = async ({ blogObj }) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ comment: blogObj.comment }),
  }
  const url = `${config.blogUrl}/${blogObj.id}/comments`
  const response = await fetch(url, options)

  if (!response.ok) {
    throw new Error(`adding comments: ${response.statusText}`)
  }

  return response.json()
}

const del = async ({ blogObj, token }) => {
  const options = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', Authorization: toBearer(token) },
  }

  const response = await fetch(`${config.blogUrl}/${blogObj.id}`, options)

  if (!response.ok) {
    throw new Error(`deleting blog: ${response.statusText}`)
  }
  return true
}

export default { getAll, add, updateLikes, addComment, del }
