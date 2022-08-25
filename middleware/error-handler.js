// const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {

  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Something went wrong try again later'
  }

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ message: err.message })
  // }

  if (err.name === 'ValidationError') {
    customError.message = Object.values(err.errors).map(item => item.message).join(', ')
    customError.statusCode = 400
  }

  if (err.code && err.code === 11000) {
    customError.message = `This ${Object.keys(err.keyValue)} already exists`
    customError.statusCode = 400
  }

  if (err.name === 'CastError') {
    customError.message = `No item found with id: ${err.value}`
    customError.statusCode = StatusCodes.NOT_FOUND
  }

  return res.status(customError.statusCode).json({ message: customError.message })
}

module.exports = errorHandlerMiddleware
