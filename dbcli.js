// CLI command for manipulating database directly

const { readFileSync } = require('fs')
const express = require('express')
const mongoose = require('mongoose')
const config = require('./src/utils/config')
const logger = require('./src/utils/logger')
const BlogList = require('./src/models/blogList')

const app = express()

app.use(express.json())

const showInfo = async () => {
  const n = await BlogList.countDocuments()
  logger.info('database has', n, 'entries')
  process.exit(0)
}

const listEntries = async (format) => {
  const blogs = await BlogList.find({})
  switch (format) {
  case 'raw':
    console.log(blogs)
    break
  case 'json':
    console.log(JSON.stringify(blogs, ['title', 'author', 'url', 'likes', 'comments'], 2))
    break
  default:
    blogs.forEach((e) => {
      console.log('Title:', e.title)
      console.log('Author:', e.author)
      console.log('url:', e.url)
      console.log('likes:', e.likes)
      console.log('Id:', e._id.toString())
      console.log('Comments:', e.comments)
      console.log('------')
    })
  }
  process.exit(0)
}

const addStdIn = async () => {
  const data = readFileSync(0)
  const blogs = JSON.parse(data)

  const res = await BlogList.insertMany(blogs)
  logger.debug(res)
  process.exit(0)
}

const addEntry = async (title, author, url, likes) => {
  const newBlog = new BlogList({
    title: title,
    author: author,
    url: url,
    likes: Number(likes),
  })

  const res = await newBlog.save()
  logger.debug(res)
  process.exit(0)
}

const delEntries = async (ids) => {
  if (ids[0] === 'all') {
    const res = await BlogList.deleteMany({})
    logger.debug(res)
    logger.info('all clear')
  } else {
    const res = await BlogList.deleteMany({ _id: { $in: ids } })
    logger.debug(res)
  }
  process.exit(0)
}

logger.debug('connecting to', config.MONGODB_URI)
mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    logger.debug('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

const argc = process.argv.length

if (argc < 3) {
  logger.info('Usage: ', process.argv[0], '<info|list|add fields..|delete all/id..>')
  process.exit(1)
}

const cmd = process.argv[2]
const p1 = process.argv[3]

switch (cmd) {
case 'info': {
  showInfo()
  break
}
case 'list': {
  listEntries(p1)
  break
}
case 'add': {
  if (p1) {
    addEntry(p1, process.argv[4], process.argv[5], process.argv[6])
  } else {
    addStdIn()
  }
  break
}
case 'delete': {
  delEntries(process.argv.slice(3))
  break
}
default: {
  logger.error('unknown command', cmd)
  process.exit(1)
}
}
