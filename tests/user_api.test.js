const assert = require('node:assert')

const { test, before, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../src/app')
const helper = require('./test_helper')
const User = require('../src/models/user')
const config = require('../src/utils/config')
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
})


after(async () => {
  await mongoose.connection.close()
})
