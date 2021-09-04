const logger = require('./logger')

const requestLogger = (req, res, next) => {
  logger.info(
    `Method: ${req.method} - Path: ${req.path} - Body:`,
    req.body,
    `\n-----`
  )

  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  logger.error('Error: ', error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'Malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' })
  } else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' })
  }

  next(error)
}

const ensureLogin = (req, res, next) => {
  if(!req.session.user) {
    res.redirect('/user/login')
  } else {
    next()
  }
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  ensureLogin
}