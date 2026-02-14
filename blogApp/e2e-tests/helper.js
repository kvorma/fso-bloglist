import { expect } from '@playwright/test'

const login = async (page, username, password, realname = null) => {
  const loginLink = page.getByText('Please login to have full functionality')
  await loginLink.click()
  await page.waitForURL('**/login')
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
  if (realname) {
    await expect(page.getByText(`${realname} logged in`)).toBeVisible()
  }
}

const logout = async (page) => {
  await page.getByRole('button', { name: 'logout' }).click()
  await page.getByText('Log in to application')
}

const gotoPage = async (page, name) => {
  const navLink = page.getByRole('link', { name: name, exact: true })
  await navLink.click()
  await page.waitForURL(`**/${name.toLowerCase()}`)
}

const gotoBlog = async (page, title) => {
  await page.getByRole('link', { name: title, exact: true }).click()
  await page.waitForURL(`**/blogs/*`)
}

const addAllBlogs = async (page, blogs) => {
  for (const b of blogs) {
    await addBlog(page, b)
  }
}

const like = async (page, blog) => {
  const key = blog.title

  const likes = await page.getByText(/^\d+ likes/).textContent()
  const num = Number(likes.match(/^\d+/)[0]) + 1

  await page.getByRole('button', { name: 'like', exact: true }).click()
  await expect(page.getByText(`${num} likes`)).toBeVisible()
  return num
}

const addBlog = async (page, blog) => {
  await page.getByRole('button', { name: 'add blog' }).click()
  await expect(page.getByText('Add new blog')).toBeVisible()

  await page.getByPlaceholder('Blog title..').fill(blog.title)
  await page.getByPlaceholder('Blog author..').fill(blog.author)
  await page.getByPlaceholder('Blog url..').fill(blog.url)
  await expect(page.getByRole('button', { name: 'submit' })).toBeEnabled()
  await page.getByRole('button', { name: 'submit' }).click()
  await page.getByText(`${blog.title} by ${blog.author}`).waitFor()
}

export { login, logout, gotoPage, gotoBlog, addBlog, addAllBlogs, like }
