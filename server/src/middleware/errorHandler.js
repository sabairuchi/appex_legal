export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = [500, 502, 503].includes(err.statusCode)
    ? err.statusCode
    : 500;

  console.error(
    `[Error] ${req.method} ${req.url}:`,
    err.message
  );

  res.status(statusCode).json({
    success: false,
    message:
      statusCode === 502
        ? 'Bad Gateway'
        : statusCode === 503
        ? 'Service Unavailable'
        : 'Internal Server Error'
  });
};