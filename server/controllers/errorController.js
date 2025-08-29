const AppError = require('../utils/appError');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error(err);

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

const handleCastErrorDB = (err) => {
  console.log(err.path, err.value);
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errorResponse.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);
  const message = `Duplicate field value: ${value}. Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  let errors = Object.values(err.errors);
  errors = errors.map((el) => {
    // console.log(el);
    if (el.properties) return el.properties.message;
    else {
      if (el.name === 'CastError') {
        return handleCastErrorDB(el);
      }

      if (el.code === 11000) return handleDuplicateFieldsDB(el);

      if (el.name === 'ValidationError') return handleValidationErrorDB(el);

      if (el.name === 'JsonWebTokenError') return handleJWTError();

      if (el.name === 'TokenExpiredError') return handleExpiredTokenError();
    }
  });
  errors = errors.join('. ');
  return new AppError(errors, 400);
};

const handleJWTError = () => new AppError('Invalid token. Please log in again', 401);

const handleExpiredTokenError = () =>
  new AppError('Your token has expired. Please log in again', 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') {
      error = handleCastErrorDB(error);
    }

    if (err.code === 11000) error = handleDuplicateFieldsDB(error);

    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);

    if (err.name === 'JsonWebTokenError') error = handleJWTError();

    if (err.name === 'TokenExpiredError') error = handleExpiredTokenError();

    sendErrorProd(error, res);
  }
};
