// FullStackOpen - harjoitustyö
// Ymoäristömuuttujien käsittely
// (c) 2025 Kai Vorma

const dx = require('@dotenvx/dotenvx')
const test = process.env.NODE_ENV === 'test'
//const prod = process.env.NODE_ENV === 'production'
const db = test ? 'blogTest' : 'blogList'

if (process.env.GITHUB_ACTIONS) {
  dx.config({ path: '.env.github', quiet: true })
} else if (process.env.FLY_APP_NAME) {
  dx.config({ path: '.env.fly', quiet: true })
} else {
  dx.config({ path: '.env', quiet: true })
}

const PORT = test ? process.env.PORT_TEST : process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI + db
const DEBUG_LEVEL = process.env.DEBUG_OVERRIDE || (test ? 0 : process.env.DEBUG_LEVEL) || 0
const QUIET = (test ? true : process.env.QUIET) || false
if (DEBUG_LEVEL > 0) {
  console.log('Config loaded:', { NODE_ENV: process.env.NODE_ENV, test, MONGODB_URI, PORT, DEBUG_LEVEL, QUIET })
}
if (!MONGODB_URI || !PORT) {
  console.error('Error: Missing required environment variables. Please check your .env file.')
  process.exit(1)
}
module.exports = { MONGODB_URI, PORT, DEBUG_LEVEL, QUIET }
