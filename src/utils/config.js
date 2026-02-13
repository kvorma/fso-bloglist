// FullStackOpen - harjoitustyö
// Ymoäristömuuttujien käsittely
// (c) 2025 Kai Vorma

require('@dotenvx/dotenvx').config({ debug: true })
const test = process.env.NODE_ENV === 'test'
const prod = process.env.NODE_ENV === 'production'
const db = test ? 'blogTest' : 'blogList'

const PORT = process.env.PORT || 3003
const MONGODB_URI = process.env.MONGODB_URI + db
const DEBUG = test || prod ? 0 : process.env.DEBUG || 0
const QUIET = test || prod ? true : process.env.QUIET || false
console.log('Config loaded:', { NODE_ENV: process.env.NODE_ENV, test, MONGODB_URI, PORT, DEBUG, QUIET })

module.exports = { MONGODB_URI, PORT, DEBUG, QUIET }
