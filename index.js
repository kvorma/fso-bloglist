// FullStackOpen - harjoitustyö
// sovelluksen käynnistys
// (c) 2025 Kai Vorma

const app = require('./app') // varsinainen Express-sovellus
const config = require('./utils/config')
const logger = require('./utils/logger')

const db = config.MONGODB_URI
const coll = db.substring(db.lastIndexOf('/') + 1)

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}, using database "${coll}"`)
})
