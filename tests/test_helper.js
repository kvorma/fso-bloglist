const jwt = require('jsonwebtoken')
const Blog = require('../models/blogList')
const User = require('../models/user')
const logger = require('../utils/logger')
const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: '7'
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: '5'
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: '12'
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: '10'
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: '0'
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: '2'
  }
]

const initialUsers = [
  {
    username: 'root',
    realname: 'Superuser',
    blogs: [ ],
    passwordHash: '$2b$10$SlblZ8Z7.088vyR87.PodOwVgDxKFZop6FkuwjugtDNesN1EtTTPq' // 'sekret'
  },
  {
    username: 'mluukkai',
    realname: 'Matti Luukkainen',
    blogs: [ ],
    passwordHash: '$2b$10$mBZeXJO7U52NiG22ioY3y.zMzjiQrqqdBUTb5iKJs0xiPCI1pRjMu' // 'salainen'
  },
  {
    username: 'vode',
    realname: 'Kai Vorma',
    blogs: [ ],
    passwordHash: '$2b$10$AvvuCM9HhpHtlIdf73cdtep6kP5grqM55DSoqP/6ngoN49Z.jpjIi' // 'ei muista'
  }
]

const getToken = () => {

  const user = {
    username: 'root',
    id: '6939863e14c8db1ce04e32a8'
  }

  const token = jwt.sign(user, process.env.SECRET)
  logger.debug2('getToken:', token)
  return token
}


const initTestData = async () => {
  await User.deleteMany({})
  await User.insertMany(initialUsers)
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)

  // set ownership of all blogs to "root"

  const blogList = await Blog.find({})
  logger.debug2('Initial blogs:', blogList)
  const blogIdList = blogList.map(i => i._id)
  const blogOwner = await User.findOneAndUpdate ({ username: 'root' }, { blogs: blogIdList })
  await Blog.updateMany({}, { owner: blogOwner._id })
}

const nonExistingId = async () => {
  const blog = new Blog({ title: 'will', author: 'remove', url: 'this', likes: '0' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, initialUsers, initTestData, getToken, nonExistingId, blogsInDb, usersInDb
}
