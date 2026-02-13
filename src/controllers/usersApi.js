const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const logger = require('../utils/logger')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', { url: 1, title: 1, author: 1 })
  response.json(users)
})

// accepts single user or list of users for quick db initialization.
// stops at first error in the latter case

usersRouter.post('/', async (request, response) => {
  let newUsers = []
  const users = Array.isArray(request.body)
    ? request.body
    : [request.body]

  for (let u of users) {
    const { username, realname, password } = u
    if (!(username && password)) {
      return response
        .status(400)
        .json({ error: `Username or password missing for [${realname}]` })
    }
    if (password.length < 3) {
      return response
        .status(400)
        .json({ error: `Password too short for ${username}` })
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    newUsers.push({
      username: username,
      realname: realname,
      passwordHash: passwordHash
    })
  }
  logger.debug('Inserting to database', newUsers)
  const savedUsers = await User.insertMany(newUsers)
  response.status(201).json(savedUsers)
})

module.exports = usersRouter
