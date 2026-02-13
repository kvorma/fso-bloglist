// FullStackOpen - harjoitustyö
// middlewarea diagnostiikkaan, virheiden käsittelyyn jne
// (c) 2025 Kai Vorma

const jwt = require('jsonwebtoken')
const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.debug('Method:', request.method)
  logger.debug('Path:  ', request.path)
  logger.debug('Body:  ', request.body)
  logger.debug('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.debug('errorHandler:', error.message)

  switch(error.name) {
  case 'CastError': {
    return response.status(400).json({ error: 'malformatted id' })
  }
  case 'MongoServerError':
  case 'MongoBulkWriteError': {
    if (error.message.includes('E11000 duplicate key error'))
      return response.status(400).json({ error: '`username` must be unique' })
    break
  }
  case 'ValidationError':
  case 'TypeError':
  case 'SyntaxError': {
    // return response.status(400).json({ error: error.name, message: error.message })
    return response.status(400).json({ error: error.message })
  }
  case 'JsonWebTokenError': {
    return response.status(401).json({ error: 'Authorization token missing or invalid' })
  }
  }
  next(error)
}

const userExtractor = (request, response, next)  => {
  const authorization = request.get('authorization')
  logger.debug2('userExtractor:', authorization)

  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    logger.debug2('UserExtractor:', decodedToken)
    request.username = decodedToken.username
  } else {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  next()
}


module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  userExtractor
}
