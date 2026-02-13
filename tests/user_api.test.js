const assert = require('node:assert')

const { test, before, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')
const config = require('../utils/config')
const api = supertest(app)

before(() => {
  console.log('Using database', config.MONGODB_URI.split('/').pop())
})

beforeEach(async () => {
  await User.deleteMany({})
  await User.insertMany(helper.initialUsers)
})

describe('userApi: First some generic consistency checks..', () => {
  test('unknown path is handled right', async () => {
    await api
      .get('/api/userss')
      .expect(404)
  })

  test('Users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all users are returned', async () => {
    const response = await api.get('/api/users')

    assert.strictEqual(response.body.length, helper.initialUsers.length)
  })

  test('all users have id field', async () => {
    const response = await api.get('/api/users')
    // delete response.body[1].id // uncomment to introduce error
    const missing = response.body.map((i) => Object.keys(i).includes('id'))

    assert(!missing.includes(false))
  })

  test('a specific user is found from user listing', async () => {
    const response = await api.get('/api/users')

    const usernames = response.body.map(e => e.username)
    assert(usernames.includes('root'))
  })
})

describe('userAPI: Then operations that modify database', () => {
  test('a valid user can be added ', async () => {
    const newUser = {
      username: 'admin',
      realname: 'System Administrator',
      password: 'good one'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, helper.initialUsers.length + 1)

    const admin = usersAtEnd.map(n => n.username)
    assert(admin.includes('admin'))
  })

  test('username must be unique', async () => {
    const newUser = {
      username: 'root',
      realname: 'Root Beer',
      password: 'a bad one'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test('user with short password is not accepted', async () => {
    const newUser = {
      username: 'test1',
      realname: 'Short One',
      password: '12'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test('user without required fields is not accepted', async () => {
    const newUser = {
      // username: 'test1',
      realname: 'Missing One',
      password: '#%%"%#'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })
/*
  test('a user entry can be updated ', async () => {

    const newUser = {
      likes: '200'
    }

    const usersAtStart = await helper.usersInDb()
    const userToUpdate = usersAtStart[1]

    await api
      .put(`/api/users/${userToUpdate.id}`)
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)

    const likes = usersAtEnd.find(b => b.id === userToUpdate.id).likes
    assert.strictEqual(likes, 200)

    const title = usersAtEnd.map(n => n.title)
    assert(title.includes('Go To Statement Considered Harmful'))
  })

  test('update fails for illegal values ', async () => {

    const newBlog = {
      likes: '-1'
    }

    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[1]

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newBlog)
      .expect(400)
  })


test('a specific blog can be viewed', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToView = blogsAtStart[0]


  const resultBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(resultBlog.body, blogToView)
})


  test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    const titles = blogsAtEnd.map(n => n.title)

    assert(!titles.includes(blogToDelete.title))
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

    // second delete should not cause any issues
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)
  })
*/
})


after(async () => {
  await mongoose.connection.close()
})
