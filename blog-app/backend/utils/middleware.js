const { response } = require("express")
const request = require("superagent")
const logger = require("./logger")
const jwt = require("jsonwebtoken")

const requestLogger = (request, response, next) => {
  // simple alternative to morgan logger
  logger.info("Method:", request.method)
  logger.info("Path:  ", request.path)
  logger.info("Body:  ", request.body)
  logger.info("---")
  logger.info("Token: ", request.token)
  logger.info("User:  ", request.user)
  logger.info("---")
  next()
}

const tokenExtractor = (request, response, next) => {
  //  const authorization = request.get("authorization")
  //  const token = authorization.slice(7)
  //  request.body.token = token

  //  request.body.token = request.get("authorization").slice(7)

  const authorization = request.get("authorization")
  request.token =
    authorization && authorization.toLowerCase().startsWith("bearer ")
      ? authorization.slice(7)
      : null
  // `bear ` sliced out, generate a new string of token
  next()
}

const userExtractor = (request, response, next) => {
  logger.info(undefined !== null, null ? 1 : 2, request.token)
  request.user = request.token
    ? jwt.verify(request.token, process.env.SECRET_KEY)
    : null
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}

const errorHandler = (error, request, response, next) => {
  // custom error handler
  logger.error(error.message)

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" })
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message })
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "invalid token" })
  }

  next(error) // default error handler
}

module.exports = {
  requestLogger,
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler,
}
