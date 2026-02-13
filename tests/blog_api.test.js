const assert = require('node:assert')

const { test, before, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
// const Blog = require('../models/blogList')
// const User = require('../models/user')
const config = require('../utils/config')
const api = supertest(app)

before(() => {
  console.log('** Using database', config.MONGODB_URI.split('/').pop(), '**')
})

beforeEach(async () => {
  await helper.initTestData()
})

describe('blogApi: First some generic consistency checks..', () => {

  test('unknown path is handled right', async () => {
    await api
      .get('/api/blogss')
      .expect(404)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('all blogs have id field', async () => {
    const response = await api.get('/api/blogs')
    // delete response.body[1].id
    const missing = response.body.map((i) => Object.keys(i).includes('id'))

    assert.strictEqual(missing.includes(false), false)
  })

  test('a specific url is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const contents = response.body.map(e => e.url)
    assert.strictEqual(contents.includes('https://reactpatterns.com/'), true)
  })

  test('a specific blog can be viewed', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(resultBlog.body.title, blogToView.title)
  })

})

describe('blogApi: Then operations that modify database', () => {
  const bearer = 'Bearer ' + helper.getToken()

  test('Try to add blog without valid token ', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'Matti Luukkainen',
      url: 'https://fullstackopen.com/osa4/backendin_testaaminen#tehtavat-4-8-4-12',
      likes: '1000'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })

  test('a valid blog can be added ', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'Matti Luukkainen',
      url: 'https://fullstackopen.com/osa4/backendin_testaaminen#tehtavat-4-8-4-12',
      likes: '1000'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', bearer)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const title = blogsAtEnd.map(n => n.title)
    assert(title.includes('async/await simplifies making async calls'))
  })


  test('blog without likes set defaults to zero', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'Matti Luukkainen',
      url: 'https://fullstackopen.com/osa4/backendin_testaaminen#tehtavat-4-8-4-12',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', bearer)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const allBlogs = await helper.blogsInDb()
    const nb = allBlogs.find((s) => s.title === 'async/await simplifies making async calls')

    assert(nb.likes === 0)
  })

  test('blog without required fields is not accepted', async () => {
    const newBlog = {
      title: '',
      author: 'Matti Luukkainen',
      url: ''
    }

    await api
      .post('/api/blogs')
      .set('Authorization', bearer)
      .send(newBlog)
      .expect(400)
  })

  test('a blog entry can be updated ', async () => {

    const newBlog = {
      likes: '200'
    }

    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[1]

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', bearer)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

    const likes = blogsAtEnd.find(b => b.id === blogToUpdate.id).likes
    assert.strictEqual(likes, 200)

    const title = blogsAtEnd.map(n => n.title)
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
      .set('Authorization', bearer)
      .send(newBlog)
      .expect(400)
  })

  test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', bearer)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    const titles = blogsAtEnd.map(n => n.title)

    assert(!titles.includes(blogToDelete.title))
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

    // second delete should not cause any issues
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', bearer)
      .expect(204)
  })
})


after(async () => {
  await mongoose.connection.close()
})
