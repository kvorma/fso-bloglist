// FullStackOpen - harjoitustyö
// sovelluksen käynnistys
// (c) 2025 Kai Vorma

const app = require('./src/app') // varsinainen Express-sovellus
const config = require('./src/utils/config')
const logger = require('./src/utils/logger')

const db = config.MONGODB_URI
const coll = db.substring(db.lastIndexOf('/') + 1)

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}, using database "${coll}"`)
})
