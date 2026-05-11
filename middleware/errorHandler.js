function errorHandler(err, req, res, next) {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';

  return res.status(statusCode).json({
    success: false,
    message,
  });
}

module.exports = errorHandler;