import { test, expect } from '@playwright/test'
import { login, logout, gotoPage, addBlog, gotoBlog, addAllBlogs, like } from './helper'

test.describe('Blog app', () => {
  const users = [
    { username: 'mluukkai', realname: 'Matti Luukkainen', password: 'salainen' },
    { username: 'root', realname: 'Super User', password: 'sekret' },
  ]
  const blogs = [
    {
      title: 'Art of using the Force',
      author: 'Superuser',
      url: 'http://127.0.0.1/',
    },
    {
      title: 'My life at the bottom',
      author: 'Super User',
      url: 'http://localhost/',
    },
    {
      title: 'FullStackOpen Rocks!',
      author: 'Anonymous',
      url: 'http://0.0.0.0/',
    },
  ]

  test.beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3004/api/testing/reset')
    page.on('dialog', (dialog) => dialog.accept())
    for (const u of users) {
      await request.post('http://localhost:3004/api/users', {
        data: { username: u.username, realname: u.realname, password: u.password },
      })
    }

    await page.goto('/')
  })

  test('Front page is shown', async ({ page }) => {
    await expect(page.getByText('Full Stack Open course 2025 -- exercise 7.21')).toBeVisible()
  })

  test.describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      const { username, realname, password } = users[0]
      await login(page, username, password, realname)
    })

    test('fails with wrong credentials', async ({ page }) => {
      await login(page, '007', 'erittäinsalainen')
      await expect(page.getByText('Incorrect username or password!')).toBeVisible()
      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('Incorrect')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
    })
  })

  test.describe('When logged in', () => {
    test.beforeEach(async ({ page }) => {
      const { username, realname, password } = users[0]
      await login(page, username, password, realname)
    })

    test('a new blog can be created', async ({ page }) => {
      const blog = blogs[0]
      await gotoPage(page, 'blogs')
      await addBlog(page, blog)
    })

    test('and it can be "liked"', async ({ page }) => {
      const blog = blogs[1]

      await gotoPage(page, 'blogs')
      await addAllBlogs(page, blogs)
      await gotoBlog(page, blog.title)

      await like(page, blog)
      await like(page, blog)
    })

    test('and deleted', async ({ page }) => {
      const blog = blogs[1]

      await gotoPage(page, 'blogs')
      await addAllBlogs(page, blogs)
      await gotoBlog(page, blog.title)

      await page.getByRole('button', { name: 'delete' }).click()
      await expect(page.getByText(/blog.*deleted/)).toBeVisible()
    })

    test('test blog sorting functionality', async ({ page }) => {
      await gotoPage(page, 'blogs')
      await addAllBlogs(page, blogs)
      await gotoBlog(page, blogs[2].title)
      await like(page, blogs[2].title)
      await gotoPage(page, 'blogs')

      await page.getByRole('button', { name: 'order by likes' }).click()
      expect(page.getByRole('button', { name: 'original order' })).toBeVisible()

      const firstBlog = page.locator('ul > li').first()
      await expect(firstBlog).toContainText(blogs[2].title)
    })
  })

  test.describe('Tests with multiple users', () => {
    test('only blog owner has delete button', async ({ page }) => {
      await login(page, users[0].username, users[0].password, users[0].realname)

      await gotoPage(page, 'blogs')
      await addBlog(page, blogs[0])
      await addBlog(page, blogs[1])

      await gotoBlog(page, blogs[1].title)
      await expect(page.getByRole('button', { name: 'delete' })).toBeVisible()

      await logout(page)
      await login(page, users[1].username, users[1].password, users[1].realname)

      await gotoPage(page, 'blogs')
      await gotoBlog(page, blogs[1].title)
      await expect(page.getByText('comments')).toBeVisible()
      await expect(page.getByRole('button', { name: 'delete' })).not.toBeVisible()
    })
  })
})
