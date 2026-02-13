// Full Stack Open harjoitustyö
// globaaleja asetuksia, apurutiineita

let server = '/' 
if (import.meta.env.PROD) {
  server = 'https://fso-bloglist-back.fly.dev/'
} 

const blogUrl = `${server}api/blogs`
const loginUrl = `${server}api/login`

const loggedTag = 'loggedBlogListUser'

export default { blogUrl, loginUrl, loggedTag }
