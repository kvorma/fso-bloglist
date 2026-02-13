

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((s, i) => {
      //     console.log("reduce:",s,i.likes)
      return s+i.likes
    }, 0)
}

const mostLiked = (blogs) => {
  let max = -1, maxid = -1
  for (let i = 0; i < blogs.length; i++) {
    if (blogs[i].likes > max) {
      max = blogs[i].likes
      maxid = i
    }
  }
  return maxid === -1 ? null : blogs[maxid]
}

const mostBlogs = (blogs) => {
  let max = -1, maxkey = null
  let author = {}

  for (let i = 0; i < blogs.length; i++) {
    let a = blogs[i].author
    if (! author[a]) {
      author[a] = 1
    } else {
      author[a]++
    }
  }
  console.log(author)
  for (i in author) {
    console.log(i, author[i])
    if (author[i] > max) {
      max = author[i]
      maxkey = i
    }
    // console.log (maxkey, max)
  }
  return maxkey ? { author: maxkey, blogs: max } : {}
}

const mostLikes = (blogs) => {
  let max = -1, maxkey = null
  let author = {}

  for (let i = 0; i < blogs.length; i++) {
    let a = blogs[i].author
    if (! author[a]) {
      author[a] = blogs[i].likes
    } else {
      author[a] += blogs[i].likes
    }
  }
  console.log(author)
  for (i in author) {
    console.log(i, author[i])
    if (author[i] > max) {
      max = author[i]
      maxkey = i
    }
    // console.log (maxkey, max)
  }
  return maxkey ? { author: maxkey, likes: max } : {}
}

module.exports = {
  totalLikes, mostLiked, mostBlogs, mostLikes
}
