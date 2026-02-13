// FullStackOpen - harjoitustyö
// Ymoäristömuuttujien käsittely
// (c) 2025 Kai Vorma

const dx = require('@dotenvx/dotenvx')
const test = process.env.NODE_ENV === 'test'
const prod = process.env.NODE_ENV === 'production'
const db = test ? 'blogTest' : 'blogList'

if (process.env.GITHUB_ACTIONS) {
  dx.config({ path: '.env.github', silent: true })
} else {
  dx.config({ path: '.env', silent: true })
}

const PORT = process.env.PORT || 3003
const MONGODB_URI = process.env.MONGODB_URI + db
const DEBUG_LEVEL = test || prod ? 0 : process.env.DEBUG_LEVEL || 0
const QUIET = test ? true : process.env.QUIET || false
console.log('Config loaded:', { NODE_ENV: process.env.NODE_ENV, test, MONGODB_URI, PORT, DEBUG_LEVEL, QUIET })

module.exports = { MONGODB_URI, PORT, DEBUG_LEVEL, QUIET }
