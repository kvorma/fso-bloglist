//const { test, expect, beforeEach, describe } = require('@playwright/test')
//const { login, logout, addBlog, addAllBlogs, like } = require('./helper')
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

    await page.goto('http://localhost:5173')
  })

  test('Front page is shown', async ({ page }) => {
    await expect(page.getByText('Full Stack Open course 2025 -- exercise 7.21')).toBeVisible()
  })

  test.describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      const { username, realname, password } = users[0]
      await login(page, username, password)
      await expect(page.getByText(`${realname} logged in`)).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await login(page, '007', 'erittäinsalainen')
      await expect(page.getByText('Incorrect username or password!')).toBeVisible()
      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('Incorrect')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText(`007 logged in`)).not.toBeVisible()
    })
  })

  test.describe('When logged in', () => {
    test.beforeEach(async ({ page }) => {
      const { username, realname, password } = users[0]
      await login(page, username, password)
      await expect(page.getByText(`${realname} logged in`)).toBeVisible()
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
    /*
        test('test blog sorting functionality', async ({ page }) => {
          const likesOrder = [2, 4, 3]
    
          await gotoPage(page, 'blogs')
          await addAllBlogs(page, blogs)
          // await page.pause()
          for (let l = 0; l < likesOrder.length; l++) {
            for (let i = 0; i < likesOrder[l]; i++) {
              await gotoBlog(page, blogs[l].title)
              await like(page, blogs[l].title)
              await gotoPage(page, 'blogs')
            }
          }
          // await page.pause()
          await page.getByRole('button', { name: 'order by likes' }).click()
          likesOrder.sort((a, b) => b - a)
    
          let i = 0
          for (const row of await page.getByText(/likes: \d+/).all()) {
            let likesText = await row.textContent()
            let likes = Number(likesText.match(/\d+/)[0])
            expect(likes).toBe(likesOrder[i++])
          }
        })
      })
    
      test.describe('Tests with multiple users', () => {
        test('only blog owner has delete button', async ({ page }) => {
          let user = users[1],
            blog = blogs[1]
          await login(page, user.username, user.password)
          await addBlog(page, blogs[0])
          await addBlog(page, blogs[1])
    
          await expect(
            page
              .getByText(`${blog.title} - ${blog.author}`)
              .getByRole('button', { name: 'delete' })
          ).toBeVisible()
          await logout(page)
          user = users[0]
          await login(page, user.username, user.password)
          await expect(
            page
              .getByText(`${blog.title} - ${blog.author}`)
              .getByRole('button', { name: 'delete' })
          ).not.toBeVisible()
        })*/
  })
})
