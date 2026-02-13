// FullStackOpen - harjoitustyö
// Rutiinit API kutsujen käsittelyyn
// (c) 2025 Kai Vorma

const blogsRouter = require('express').Router()
const Blog = require('../models/blogList')
const User = require('../models/user')
const logger = require('../utils/logger')
const middleware = require('../utils/middleware')

// Get all blogs

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('owner', { username: 1, realname: 1 })
  response.json(blogs)
})

// Get blog by ID

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('owner', {
    username: 1,
    realname: 1,
  })
  response.json(blog)
})

// add one or more blogs

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  let savedBlogs = [],
    newBlogs = []
  const blogs = Array.isArray(request.body) ? request.body : [request.body]

  logger.debug('AddBlog: user =', request.username, 'token =', request.token)

  // Find owner information

  const owner = await User.findOne({ username: request.username })
  logger.debug2('owner:', owner)

  // Create list of new blogs and insert into database
  for (let b of blogs) {
    newBlogs.push({
      title: b.title,
      author: b.author,
      url: b.url,
      likes: b.likes,
      owner: owner._id,
      comments: b.comments,
    })
  }
  logger.debug2('Inserting blogs:', newBlogs)
  savedBlogs = await Blog.insertMany(newBlogs)

  // update owner document with new blogs

  const ownerIds = savedBlogs.map((i) => i._id)
  owner.blogs = owner.blogs.concat(ownerIds)
  logger.debug(`Adding id's to ${owner.username} record`, ownerIds)
  logger.debug2('All blogs', owner.blogs)
  await owner.save()

  // generate response

  const savedBlog = await Blog.findById(savedBlogs[0]._id).populate('owner', {
    username: 1,
    realname: 1,
  })
  logger.debug2('response(201):', savedBlog)
  response.status(201).json(savedBlog)
})

// Update existing blog

blogsRouter.put('/:id', middleware.userExtractor, async (request, response) => {
  const body = request.body
  logger.debug('UpdBlog:', body)

  // find blog & owner

  const blog = await Blog.findById(request.params.id)
  if (!blog) return response.status(404).end()
  const owner = await User.findById(blog.owner)
  logger.debug2('Comparing', owner.username, request.username)

  // permission check

  if (owner.username !== request.username) {
    return response.status(401).json({ error: 'permission denied' })
  }

  // update fields found from body

  if (body.title) blog.title = body.title
  if (body.author) blog.author = body.author
  if (body.url) blog.url = body.url
  if (body?.likes !== '') blog.likes = body.likes

  // save and send response

  let res = await blog.save()
  logger.debug2(body, res)
  response.status(201).json(res)
})

// update likes field, no user authorization needed

blogsRouter.patch('/:id', async (request, response) => {
  const body = request.body
  logger.debug('UpdLikes:', body)

  // find blog & update likes

  const blog = await Blog.findById(request.params.id)
  if (!blog) return response.status(404).end()

  if (body?.likes !== '') blog.likes = body.likes

  // save and send response

  let res = await blog.save()
  logger.debug2(body, res)
  response.status(201).json(res)
})

// add comment to blog[id]

blogsRouter.post('/:id/comments', async (request, response) => {
  const body = request.body
  logger.debug('Add comments:', body)

  // find blog & update likes

  const blog = await Blog.findById(request.params.id)
  if (!blog) return response.status(404).end()

  if (body?.comment !== '') blog.comments.push(body.comment)

  // save and send response

  let res = await blog.save()
  logger.debug2(body, res)
  response.status(201).json(res)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  logger.debug('DelBlog: user =', request.username, 'token =', request.token)

  // find blog and check owner matches token
  const toBeDeleted = await Blog.findById(request.params.id)
  logger.debug2('ToBeDeleted:', toBeDeleted)
  if (toBeDeleted) {
    const owner = await User.findById(toBeDeleted.owner)
    logger.debug2('owner:', owner)

    // comparing usernames as database id could change due to unseen update elsewhere

    if (owner.username !== request.username) {
      return response.status(401).json({ error: 'permission denied' })
    }

    // finally delete the blog

    const res = await Blog.deleteOne({ _id: toBeDeleted._id })
    logger.debug2('deleteOne:', res)
    if (res.deletedCount !== 1) {
      return response.status(500).json('delete failed')
    }

    // do a little bit of consistency checking: update User.blogs[] from Blogs.owner data

    const blogs = await Blog.find({ owner: owner._id })
    const ownblogs = blogs.map((b) => b._id)
    logger.debug2('blogs', ownblogs)
    owner.blogs = ownblogs
    await owner.save()
  }
  response.status(204).end()
})

module.exports = blogsRouter
