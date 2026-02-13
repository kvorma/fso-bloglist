// FullStackOpen - harjoitustyö
// Ymoäristömuuttujien käsittely
// (c) 2025 Kai Vorma

require('dotenv').config()

const test = process.env.NODE_ENV === 'test'

const PORT = process.env.PORT || 3003
const MONGODB_URI = test ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI
const DEBUG = test ? 0 : process.env.DEBUG || 0
const QUIET = process.env.QUIET || false
console.log('Config loaded:', { NODE_ENV: process.env.NODE_ENV, test, PORT, MONGODB_URI, PORT, DEBUG, QUIET })

module.exports = { MONGODB_URI, PORT, DEBUG, QUIET }
