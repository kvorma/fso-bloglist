const router = require('express').Router()
const Blog = require('../models/blogList')
const User = require('../models/user')
const logger = require('../utils/logger')

router.post('/reset', async (request, response) => {
  logger.debug("Database reset called")

  await Blog.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = router
